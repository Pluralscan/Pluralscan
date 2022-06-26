from datetime import datetime
import pathlib

from pluralscan.data.inmemory.executables.executable_repository import (
    InMemoryExecutableRepository,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository
from pluralscan.domain.executable.executable_id import ExecutableId
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.infrastructure.config import Config


class ScanRepositorySeeder:
    """ScanRepositorySeeder"""

    def __init__(
        self,
        package_repository: InMemoryPackageRepository,
        executable_repository: InMemoryExecutableRepository,
        scan_repository: InMemoryScanRepository,
    ) -> None:
        """
        Construct a new 'ScanRepositorySeeder' object.
        """
        self._package_repository = package_repository
        self._exceutable_repository = executable_repository
        self._scan_repository = scan_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._scan_repository.add(
            Scan(
                scan_id=ScanId("TestSchreduled"),
                executable_id=ExecutableId("RoslynatorFork"),
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        "TestSchreduled_RoslynatorFork_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("AnalyzerTests"),
                state=ScanState.SCHREDULED,
            )
        )

        self._scan_repository.add(
            Scan(
                scan_id=ScanId("TestRunning"),
                executable_id=ExecutableId("RoslynatorFork"),
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        "TestRunning_RoslynatorFork_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("AnalyzerTests"),
                state=ScanState.RUNNING,
            )
        )
