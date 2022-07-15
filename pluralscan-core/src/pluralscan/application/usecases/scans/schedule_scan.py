from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List
import functools
import operator

from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.executables.executable import Executable
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
        job_runner: AbstractJobRunner,
    ):
        self._scan_repository = scan_repository
        self._package_repository = package_repository
        self._analyzer_repository = analyzer_repository
        self._job_runner = job_runner

    def handle(self, command: ScheduleScanCommand) -> ScheduleScanResult:
        # 1. Find package inside internal registry
        package = self._package_repository.get_one(command.package_id)
        if package is None:
            raise ValueError

        # 2. Retrieve analyzers.
        analyzer_ids = list(command.analyzers.keys())
        analyzers: List[Analyzer] = self._analyzer_repository.find_many(analyzer_ids)
        if len(analyzers) == 0:
            raise RuntimeError

        # 3. Retrieve executables used to perform analysis.
        executables: List[Executable] = [
            analyzer.find_executables_by_version(
                command.analyzers.get(analyzer.analyzer_id)
            )
            for analyzer in analyzers
        ]
        executables = functools.reduce(operator.iconcat, executables, [])
        if executables is None:
            raise RuntimeError("No executable found.")

        # 4. Prepare and persist scans.
        group_id = datetime.now().timestamp()
        scans = []
        for executable in executables:
            scan_id = self._scan_repository.next_id()
            scan = Scan(
                scan_id=scan_id,
                analyzer_id=executable.analyzer_id,
                executable_version=executable.version,
                package_id=package.package_id,
                working_directory=command.working_directory,
                state=ScanState.SCHEDULED,
                batch=str(group_id),
            )
            scans.append(scan)

        scans = self._scan_repository.add_bulk(scans)

        # 5. Emit jobs
        for scan in scans:
            self._job_runner.schedule(str(scan.scan_id))

        return ScheduleScanResult(scans)
