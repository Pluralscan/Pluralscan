import pathlib

from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_registry import PackageRegistry
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
                package_id=PackageId("Cast.RestClient"),
                name="Cast.RestClient",
                version="1.0.0",
                registry=PackageRegistry.LOCAL,
                storage="",
                published_at="",
                technology=Technology.csharp()
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                version="1.4",
                registry=PackageRegistry.NPM,
                storage="",
                published_at="",
                technology=Technology.javascript()
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("AnalyzerTests"),
                name="AnalyzerTests",
                version="1.0",
                registry=PackageRegistry.LOCAL,
                storage=str(
                    pathlib.Path.joinpath(
                        Config.SOURCES_DIR, "AnalyzerTests/AnalyzerTests.sln"
                    )
                ),
                published_at="",
                technology=Technology.csharp(),
            )
        )
