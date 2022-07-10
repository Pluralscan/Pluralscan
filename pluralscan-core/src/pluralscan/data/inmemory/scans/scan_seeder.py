import pathlib
from datetime import datetime

from pluralscan.data.inmemory.executables.executable_repository import (
    InMemoryExecutableRepository,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.packages.package_id import PackageId
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
                scan_id=ScanId("TestScheduled"),
                executable_id=ExecutableId("RoslynatorFork"),
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        f"TestScheduled_RoslynatorFork_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("AnalyzerTests"),
                state=ScanState.SCHEDULED,
            )
        )

        self._scan_repository.add(
            Scan(
                scan_id=ScanId("TestRunning"),
                executable_id=ExecutableId("RoslynatorFork"),
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        f"TestRunning_RoslynatorFork_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("AnalyzerTests"),
                state=ScanState.RUNNING,
            )
        )

        self._scan_repository.add(
            Scan(
                scan_id=ScanId("gat"),
                executable_id=ExecutableId("DependencyCheck"),
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        f"TestRunning_DependencyCheck_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("gat"),
                state=ScanState.SCHEDULED,
            )
        )
