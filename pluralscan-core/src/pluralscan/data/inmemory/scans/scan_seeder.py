import pathlib
from datetime import datetime

from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
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
        scan_repository: InMemoryScanRepository,
    ) -> None:
        """
        Construct a new 'ScanRepositorySeeder' object.
        """
        self._package_repository = package_repository
        self._scan_repository = scan_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._scan_repository.add(
            Scan(
                aggregate_id=ScanId("TestScheduled"),
                analyzer_id=AnalyzerId("Roslynator"),
                executable_version="0.3.3.0F",
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
                aggregate_id=ScanId("TestRunning"),
                analyzer_id=AnalyzerId("Roslynator"),
                executable_version="0.3.3.0F",
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
                aggregate_id=ScanId("gat"),
                analyzer_id=AnalyzerId("DependencyCheck"),
                executable_version="7.1.1",
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

        self._scan_repository.add(
            Scan(
                aggregate_id=ScanId("machin"),
                analyzer_id=AnalyzerId("Clippy"),
                executable_version="0.1.57",
                working_directory=str(
                    pathlib.Path.joinpath(
                        Config.REPORTS_DIR,
                        f"machin_Clippy_{0}".format(
                            str(datetime.timestamp(datetime.now()))
                        ),
                    )
                ),
                package_id=PackageId("machin"),
                state=ScanState.SCHEDULED,
            )
        )
