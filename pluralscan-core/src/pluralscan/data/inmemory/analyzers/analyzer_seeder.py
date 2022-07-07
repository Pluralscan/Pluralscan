from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
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
            )
        )

        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("Sonar"),
                name="Sonar",
                technologies=[
                    Technology.dotnet(),
                ],
            )
        )

        self._analyzer_repository.add(
            Analyzer(
                analyzer_id=AnalyzerId("DependencyCheck"),
                name="Dependency Check",
                technologies=[
                    Technology.dotnet(),
                ],
            )
        )
