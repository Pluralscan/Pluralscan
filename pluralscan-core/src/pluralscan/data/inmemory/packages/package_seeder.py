from datetime import datetime
import pathlib

from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_system import PackageSystem
from pluralscan.domain.technologies.technology import Technology
from pluralscan.infrastructure.config import Config


class InMemoryPackageRepositorySeeder:
    """PackageRepositorySeeder"""

    def __init__(
        self,
        package_repository: InMemoryPackageRepository,
    ) -> None:
        """
        Construct a new 'InMemoryAnalyzerRepositorySeeder' object.
        """
        self._package_repository = package_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._package_repository.add(
            Package(
                package_id=PackageId("WebGoat.NET"),
                name="WebGoat.NET",
                version="1.0.0",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(
                        Config.PACKAGES_DIR, "TEST/WebGoat.NET-master.zip"
                    )
                ),
                published_at=datetime.now(),
                technologies=[Technology.dotnet()],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                version="1.4",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(
                        Config.PACKAGES_DIR, "TEST/NodeGoat-master.zip"
                    )
                ),
                published_at=datetime.now(),
                technologies=[Technology.nodejs()],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("AnalyzerTests"),
                name="AnalyzerTests",
                version="1.0",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(Config.PACKAGES_DIR, "TEST/AnalyzerTests.zip")
                ),
                published_at=datetime.now(),
                technologies=[Technology.dotnet()],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("gat"),
                name="gat",
                version="1.0",
                description="Gat is a program that can be used in a terminal, it allows you to count the number of words or lines...",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(Config.PACKAGES_DIR, "TEST/GatGitlab.zip")
                ),
                published_at=datetime.now(),
                technologies=[Technology.golang()],
            )
        )
