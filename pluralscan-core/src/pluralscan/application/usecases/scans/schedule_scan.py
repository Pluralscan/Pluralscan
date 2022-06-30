from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List

from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher, AbstractPackageFetcherFactory,
    DownloadPackageResult)
from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.executables.executable_repository import \
    AbstractExecutableRepository
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.libs.utils.validable import Validable


@dataclass(frozen=True)
class ScheduleScanCommand(Validable):
    """ScheduleRemoteScanCommand"""

    uri: str
    executables: List[ExecutableId]
    working_directory: str

    def __post_init__(self):
        if not self.uri:
            raise ValueError("An uri must be defined.")


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
        package_fetcher_factory: AbstractPackageFetcherFactory,
        executable_repository: AbstractExecutableRepository,
        job_runner: AbstractJobRunner,
    ):
        self._scan_repository = scan_repository
        self._package_repository = package_repository
        self._package_fetcher_factory = package_fetcher_factory
        self._executable_repository = executable_repository
        self._job_runner = job_runner

    def handle(self, command: ScheduleScanCommand) -> ScheduleScanResult:
        # 1. Retrieve executables used to perform analysis.
        executables = self._executable_repository.find_many(command.executables)
        if executables is None:
            raise RuntimeError("No executable found.")

        # 2. Check if package is already registred into internal registry
        package = self._package_repository.find_by_location(command.uri)
        if package is None:
            # 2.1. Create a new package fetcher dynamically according to origin
            package_fetcher: AbstractPackageFetcher = (
                self._package_fetcher_factory.create(command.uri)
            )

            # 2.2. Retrieve package info
            package_info = package_fetcher.get_info(command.uri)
            if package_info is None or not package_info.success:
                raise RuntimeError

            # 2.3. Download package
            download_result: DownloadPackageResult = package_fetcher.download(
                command.uri, command.working_directory
            )
            if download_result.success is not True:
                raise RuntimeError(download_result.error)

            # 2.4. Persist package
            package = Package(
                name=package_info.name, location=download_result.output_dir
            )
            package = self._package_repository.add(package)

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
