from datetime import datetime
import pathlib

from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_link import PackageLink, PackageLinkLabel
from pluralscan.domain.packages.package_system import PackageSystem
from pluralscan.domain.shared.technology import Technology
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
                description="This web application is a learning platform that attempts to teach about \
                            common web security flaws. It contains generic security flaws that apply to \
                            most web applications. It also contains lessons that specifically pertain to \
                            the .NET framework. The excercises in this app are intented to teach about  \
                            web security attacks and how developers can overcome them.",
                version="TEST",
                author="jerryhoff",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(
                        Config.PACKAGES_DIR, "TEST/WebGoat.NET-master.zip"
                    )
                ),
                published_at=datetime.now(),
                technologies=[Technology.dotnet()],
                links=[PackageLink(PackageLinkLabel.SOURCE_REPO, "https://github.com/jerryhoff/WebGoat.NET")]
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("NodeGoat"),
                name="NodeGoat",
                description="This project provides an environment to learn how OWASP Top 10 security risks apply to web applications developed using Node.js and how to effectively address them.",
                version="TEST",
                author="OWASP",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(
                        Config.PACKAGES_DIR, "TEST/NodeGoat-master.zip"
                    )
                ),
                published_at=datetime.now(),
                technologies=[Technology.nodejs()],
                links=[
                    PackageLink(
                        PackageLinkLabel.SOURCE_REPO,
                        "https://github.com/OWASP/NodeGoat",
                    )
                ],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("AnalyzerTests"),
                name="AnalyzerTests",
                author="Gromat Luidgi",
                version="TEST",
                description="C# Test Project",
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
                package_id=PackageId("WebGoatCore"),
                name="WebGoatCore",
                author="tobyash86",
                version="TEST",
                description="WebGoat.NETCore - port of original WebGoat.NET to .NET Core.",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(Config.PACKAGES_DIR, "TEST/WebGoatCore-master.zip")
                ),
                published_at=datetime.now(),
                technologies=[Technology.dotnet()],
                links=[
                    PackageLink(
                        PackageLinkLabel.SOURCE_REPO, "https://github.com/tobyash86/WebGoat.NET"
                    )
                ],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("gat"),
                name="gat",
                version="TEST",
                author="Méderic Bazart",
                description="Gat is a program that can be used in a terminal, it allows you to count the number of words or lines...",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(Config.PACKAGES_DIR, "TEST/GatGitlab.zip")
                ),
                published_at=datetime.now(),
                technologies=[Technology.golang()],
                links=[
                    PackageLink(
                        PackageLinkLabel.SOURCE_REPO, "https://gitlab.com/Ipfaze/gat"
                    )
                ],
            )
        )

        self._package_repository.add(
            Package(
                package_id=PackageId("machin"),
                name="machin",
                version="TEST",
                author="Jérémie Ferry",
                licenses=["MIT"],
                description="Machin is a cli program that simplifies file conversions and batch processing. It's inspired from filter/map/reduce.",
                system=PackageSystem.LOCAL,
                storage_path=str(
                    pathlib.Path.joinpath(Config.PACKAGES_DIR, "TEST/machin-master.zip")
                ),
                published_at=datetime.now(),
                technologies=[Technology.rust()],
                links=[
                    PackageLink(
                        PackageLinkLabel.SOURCE_REPO,
                        "https://github.com/OWASP/NodeGoat",
                    )
                ],
            )
        )
