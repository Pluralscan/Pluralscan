import pathlib
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.package.package_origin import PackageOrigin
from pluralscan.domain.package.package_type import PackageType
from pluralscan.domain.technology.language import Language
from pluralscan.infrastructure.config import Config


class PackageRepositorySeeder:
    """PackageRepositorySeeder"""

    def __init__(
        self,
        package_repository: InMemoryPackageRepository,
    ) -> None:
        """
        Construct a new 'AnalyzerRepositorySeeder' object.
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
                language=[Language.CSHARP],
                type=PackageType.CSPROJ,
                url="https://github.com/gromatluidgi/Cast.RestClient",
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                version="1.4",
                origin=PackageOrigin.GITHUB,
                language=[Language.JAVASCRIPT, Language.HTML],
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
                language=[Language.CSHARP],
                type=PackageType.SLN,
                location=str(pathlib.Path.joinpath(Config.SOURCES_DIR,"AnalyzerTests/AnalyzerTests.sln")),
            )
        )
