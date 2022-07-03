from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId


class InMemoryAnalyzerRepositorySeeder:
    """InMemoryAnalyzerRepositorySeeder"""

    def __init__(
        self,
        analyzer_repository: InMemoryAnalyzerRepository,
        executable_repository: InMemoryExecutableRepository,
    ) -> None:
        """
        Construct a new 'InMemoryAnalyzerRepositorySeeder' object.
        """
        self._analyzer_repository = analyzer_repository
        self._executable_repository = executable_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("Roslynator"),
                name="Roslynator",
                executables=self._executable_repository.find_by_analyzer(AnalyzerId("Roslynator")),
            )
        )

        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("Sonar"),
                name="Sonar",
                executables=self._executable_repository.find_by_analyzer(AnalyzerId("Sonar")),
            )
        )

        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("DependencyCheck"),
                name="Dependency Check",
                executables=self._executable_repository.find_by_analyzer("DependencyCheck"),
            )
        )
