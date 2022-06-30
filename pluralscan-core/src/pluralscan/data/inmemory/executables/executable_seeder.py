import pathlib

from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.executables.executable_command import ExecutableCommand
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.executables.executable_platform import \
    ExecutablePlatform
from pluralscan.domain.executables.executable_runner import ExecutableRunner
from pluralscan.infrastructure.config import Config


class ExecutableInMemoryRepositorySeeder:
    """ExecutableInMemoryRepositorySeeder"""

    def __init__(
        self,
        executable_repository: InMemoryExecutableRepository,
    ) -> None:
        """
        Construct a new 'ExecutableInMemoryRepositorySeeder' object.
        """
        self._executable_repository = executable_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._executable_repository.add(
            Executable(
                executable_id=ExecutableId("RoslynatorDotnet"),
                analyzer_id=AnalyzerId("Roslynator"),
                platform=ExecutablePlatform.DOTNET,
                name="Roslynator Dotnet",
                version="0.3.3.0",
                runner=ExecutableRunner.ROSLYNATOR,
                commands=[
                    ExecutableCommand(
                        action=ExecutableAction.SCAN,
                        arguments=["dotnet", "roslynator"],
                    )
                ],
            )
        )

        self._executable_repository.add(
            Executable(
                executable_id=ExecutableId("RoslynatorFork"),
                analyzer_id=AnalyzerId("Roslynator"),
                platform=ExecutablePlatform.WIN,
                name="Roslynator Fork",
                location= "roslynator-fork-0.3.3.0\\Roslynator.exe",
                version="0.3.3.0",
                runner=ExecutableRunner.ROSLYNATOR,
                commands=[
                    ExecutableCommand(
                        action=ExecutableAction.SCAN,
                        arguments=["analyze"],
                    )
                ],
            )
        )

        self._executable_repository.add(
            Executable(
                executable_id=ExecutableId("DependencyCheck"),
                analyzer_id=AnalyzerId("DependencyCheck"),
                platform=ExecutablePlatform.WIN,
                name="Dependency Check",
                version="1.0",
                runner=ExecutableRunner.DEPENDENCY_CHECK,
                commands=[],
            )
        )

        self._executable_repository.add(
            Executable(
                executable_id=ExecutableId("SonarDotnet"),
                analyzer_id=AnalyzerId("Sonar"),
                platform=ExecutablePlatform.DOTNET,
                name="Sonar Dotnet",
                version="5.6.0.48455-net5.0",
                runner=ExecutableRunner.SONAR,
                commands=[
                    ExecutableCommand(
                        action=ExecutableAction.SCAN,
                        arguments=[
                            "dotnet",
                            str(pathlib.Path.joinpath(Config.TOOLS_DIR, "/resources/tools/sonar-scanner-msbuild-5.6.0.48455-net5.0/SonarScanner.MSBuild.dll")),
                            "[SONAR_ACTION]"
                            '/k:"[SONAR_PROJECT_NAME]"'
                            '/d:sonar.host.url="[SONAR_SERVER_URL]"'
                            '/d:sonar.login="[SONAR_SERVER_TOKEN]"',
                        ],
                    )
                ],
            )
        )
