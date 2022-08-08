from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List
import functools
import operator

from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.domain.analyzers.analyzer import Analyzer
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.analyzers.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.analyzers.executables.executable import Executable
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState


@dataclass(frozen=True)
class ScheduleScanCommand:
    """ScheduleRemoteScanCommand"""

    package_id: PackageId
    analyzers: Dict[AnalyzerId, List[str]]
    working_directory: str

    def __post_init__(self):
        #self.analyzers = map(lambda x: { AnalyzerId(x): self.analyzers.get(x) }, self.analyzers.keys() )
        pass

@dataclass
class ScheduleScanResult:
    """ScheduleScanResult"""

    scans: List[Scan]


class AbstractScheduleScanUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractScheduleScanUseCase"""

    @abstractmethod
    def handle(self, command: ScheduleScanCommand) -> ScheduleScanResult:
        """Execute use case."""
        raise NotImplementedError


class ScheduleScanUseCase(
    AbstractScheduleScanUseCase
):  # pylint: disable=too-few-public-methods
    """ScheduleScanUseCase"""

    def __init__(
        self,
        scan_repository: AbstractScanRepository,
        package_repository: AbstractPackageRepository,
        analyzer_repository: AbstractAnalyzerRepository,
        job_runner: AbstractJobRunner = None,
    ):
        self._scan_repository = scan_repository
        self._package_repository = package_repository
        self._analyzer_repository = analyzer_repository
        self._job_runner = job_runner

    def handle(self, command: ScheduleScanCommand) -> ScheduleScanResult:
        # 1. Find package inside internal system
        package = self._package_repository.find_by_id(command.package_id)
        if package is None:
            raise RuntimeError

        schedule_scans = self._scan_repository.find_scheduled_by_package(package.package_id)
        if len(schedule_scans) > 0:
            raise RuntimeError

        # 2. Retrieve analyzers.
        analyzer_ids = list(command.analyzers.keys())
        analyzers: List[Analyzer] = self._analyzer_repository.find_many(analyzer_ids)
        if len(analyzers) == 0:
            raise RuntimeError

        # 3. Retrieve executables used to perform analysis.
        executables_group: List[List[Executable]] = [
            analyzer.find_executables_by_version(
                command.analyzers.get(analyzer.analyzer_id, [])
            )
            for analyzer in analyzers
        ]
        executables: List[Executable] = functools.reduce(operator.iconcat, executables_group, [])
        if executables is None:
            raise RuntimeError("No executable found.")

        # 4. Prepare and persist scans.
        job_id = datetime.now().timestamp()
        scans = []
        for executable in executables:
            scan_id = self._scan_repository.next_id() # obsolete ?
            scan = Scan(
                uuid=scan_id,
                version=0,
                analyzer_id=executable.analyzer_id,
                executable_version=executable.version,
                package_id=package.package_id,
                working_directory=str(Path.joinpath(command.working_directory, repr(scan_id))),
                state=ScanState.SCHEDULED,
                job_id=str(job_id),
            )
            scans.append(scan)

        scans = self._scan_repository.add_bulk(scans)

        # 5. Emit jobs
        if self._job_runner is not None:
            for scan in scans:
                self._job_runner.schedule(str(scan.uuid))

        return ScheduleScanResult(scans)
