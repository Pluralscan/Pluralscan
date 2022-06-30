import pathlib

from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_origin import PackageOrigin
from pluralscan.domain.packages.package_type import PackageType
from pluralscan.domain.technologies.language import (CSHARP, JAVASCRIPT,
                                                     LanguageProvider)
from pluralscan.infrastructure.config import Config


class PackageRepositorySeeder:
    """PackageRepositorySeeder"""

    def __init__(
        self,
        package_repository: InMemoryPackageRepository,
    ) -> None:
        """
        Construct a new 'AnalyzerInMemoryRepositorySeeder' object.
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
                origin=PackageOrigin.GITHUB,
                language=[LanguageProvider.get_by_code(CSHARP)],
                type=PackageType.CONTAINER,
                url="https://github.com/gromatluidgi/Cast.RestClient",
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                version="1.4",
                origin=PackageOrigin.GITHUB,
                language=[LanguageProvider.get_by_code(JAVASCRIPT)],
                type=PackageType.NPM,
                url="https://github.com/OWASP/NodeGoat",
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("AnalyzerTests"),
                name="AnalyzerTests",
                version="1.0",
                origin=PackageOrigin.LOCAL,
                language=[LanguageProvider.get_by_code(CSHARP)],
                type=PackageType.CONTAINER,
                location=str(
                    pathlib.Path.joinpath(
                        Config.SOURCES_DIR, "AnalyzerTests/AnalyzerTests.sln"
                    )
                ),
            )
        )
