import pathlib

from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_registry import PackageRegistry
from pluralscan.domain.technologies.technology_provider import (
    CSHARP_TECHNOLOGY, JAVASCRIPT_TECHNOLOGY, TechnologyProvider)
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
                registry=PackageRegistry.NUGET,
                technologies=[TechnologyProvider.get_by_code(CSHARP_TECHNOLOGY)],
                storage=""
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                version="1.4",
                registry=PackageRegistry.NPM,
                technologies=[TechnologyProvider.get_by_code(JAVASCRIPT_TECHNOLOGY)],
                storage=""
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("AnalyzerTests"),
                name="AnalyzerTests",
                version="1.0",
                registry=PackageRegistry.LOCAL,
                technologies=[TechnologyProvider.get_by_code(CSHARP_TECHNOLOGY)],
                storage=str(
                    pathlib.Path.joinpath(
                        Config.SOURCES_DIR, "AnalyzerTests/AnalyzerTests.sln"
                    )
                ),
            )
        )
