from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List

from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    AbstractPackageFetcherFactory,
)
from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.domain.executable.executable_id import ExecutableId
from pluralscan.domain.executable.executable_repository import (
    AbstractExecutableRepository,
)
from pluralscan.domain.executable.executable_specification import (
    ExecutablesSpecification,
)
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_origin import PackageOrigin
from pluralscan.domain.package.package_repository import AbstractPackageRepository
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.libs.utils.validable import Validable


@dataclass(frozen=True)
class SchreduleScanCommand(Validable):
    """SchreduleRemoteScanCommand"""

    uri: str
    executables: List[ExecutableId]
    working_directory: str

    def __post_init__(self):
        if not self.uri:
            raise ValueError("An uri must be defined.")


@dataclass
class SchreduleScanResult:
    """SchreduleScanResult"""

    scans: List[Scan]


class AbstractSchreduleScanUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractSchreduleScanUseCase"""

    @abstractmethod
    def handle(self, command: SchreduleScanCommand) -> SchreduleScanResult:
        """Execute use case."""
        raise NotImplementedError


class SchreduleScanUseCase(
    AbstractSchreduleScanUseCase
):  # pylint: disable=too-few-public-methods
    """SchreduleScanUseCase"""

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

    def handle(self, command: SchreduleScanCommand) -> SchreduleScanResult:
        # 1. Retrieve executables used to perform analysis.
        executables = self._executable_repository.find(
            ExecutablesSpecification(command.executables)
        )
        if executables is None:
            raise RuntimeError("No executable found.")

        # 2. Check if package is already registred into internal registry
        package = self._package_repository.find_by_location(command.uri)
        if package is None:
            # 2.1. Create a new package fetcher dynamically according to origin
            origin = self._detect_origin(command.uri)
            package_fetcher: AbstractPackageFetcher = (
                self._package_fetcher_factory.create(origin, command.working_directory)
            )

            # 2.2. Retrieve package info
            package_info = package_fetcher.get_info(command.uri)
            if package_info is None or not package_info.success:
                raise RuntimeError

            # 2.3. Download package
            download_result = package_fetcher.download(command.uri)
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
                state=ScanState.SCHREDULED,
                group_id=str(group_id),
            )
            scans.append(scan)

        scans = self._scan_repository.add_bulk(scans)

        # 4. Emit jobs
        for scan in scans:
            self._job_runner.schredule(scan.scan_id)

        return SchreduleScanResult(scans)

    def _detect_origin(self, uri: str) -> PackageOrigin:
        return PackageOrigin.LOCAL
