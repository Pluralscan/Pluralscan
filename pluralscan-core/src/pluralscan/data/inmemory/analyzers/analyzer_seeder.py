from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.executables.executable_command import ExecutableCommand
from pluralscan.domain.executables.executable_platform import ExecutablePlatform
from pluralscan.domain.executables.executable_runner import ExecutableRunner
from pluralscan.domain.technologies.technology import Technology


class InMemoryAnalyzerRepositorySeeder:
    """InMemoryAnalyzerRepositorySeeder"""

    def __init__(
        self,
        analyzer_repository: InMemoryAnalyzerRepository,
    ) -> None:
        """
        Construct a new 'InMemoryAnalyzerRepositorySeeder' object.
        """
        self._analyzer_repository = analyzer_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("Roslynator"),
                name="Roslynator",
                technologies=[
                    Technology.dotnet(),
                ],
                executables=[
                    Executable(
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
                    ),
                    Executable(
                        analyzer_id=AnalyzerId("Roslynator"),
                        platform=ExecutablePlatform.WIN,
                        name="Roslynator Fork",
                        path="roslynator-fork-0.3.3.0\\Roslynator.exe",
                        version="0.3.3.0F",
                        runner=ExecutableRunner.ROSLYNATOR,
                        commands=[
                            ExecutableCommand(
                                action=ExecutableAction.SCAN,
                                arguments=["analyze"],
                            )
                        ],
                    ),
                ],
            )
        )

        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("DependencyCheck"),
                name="Dependency Check",
                technologies=[
                    Technology.dotnet(),
                    Technology.golang(),
                    Technology.java(),
                    Technology.nodejs(),
                ],
                executables=[
                    Executable(
                        analyzer_id=AnalyzerId("DependencyCheck"),
                        platform=ExecutablePlatform.WIN,
                        path="dependency-check-7.1.1-release\\bin\\dependency-check.bat",
                        name="Dependency Check",
                        version="7.1.1",
                        runner=ExecutableRunner.DEPENDENCY_CHECK,
                        commands=[
                            ExecutableCommand(
                                action=ExecutableAction.SCAN,
                                arguments=["--scan"],
                            )
                        ],
                    )
                ],
            )
        )
