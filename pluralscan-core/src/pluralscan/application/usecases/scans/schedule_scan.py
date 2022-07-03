from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List

from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.executables.executable_repository import \
    AbstractExecutableRepository
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState


@dataclass(frozen=True)
class ScheduleScanCommand:
    """ScheduleRemoteScanCommand"""

    package_id: PackageId
    executables: List[ExecutableId]
    working_directory: str


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
        executable_repository: AbstractExecutableRepository,
        job_runner: AbstractJobRunner,
    ):
        self._scan_repository = scan_repository
        self._package_repository = package_repository
        self._executable_repository = executable_repository
        self._job_runner = job_runner

    def handle(self, command: ScheduleScanCommand) -> ScheduleScanResult:
        # 2. Find package inside internal registry
        package = self._package_repository.get_one(command.package_id)
        if package is None:
            raise ValueError

        # 1. Retrieve executables used to perform analysis.
        executables = self._executable_repository.find_many(command.executables)
        if executables is None:
            raise RuntimeError("No executable found.")

        # 3. Prepare and persist scans.
        group_id = datetime.now().timestamp()
        scans = []
        for executable in executables:
            scan = Scan(
                executable_id=executable.executable_id,
                package_id=package.package_id,
                working_directory=command.working_directory,
                state=ScanState.SCHEDULED,
                group_id=str(group_id),
            )
            scans.append(scan)

        scans = self._scan_repository.add_bulk(scans)

        # 4. Emit jobs
        for scan in scans:
            self._job_runner.schedule(str(scan.scan_id))

        return ScheduleScanResult(scans)
