from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.data.inmemory.analyzers.analyzer_seeder import (
    InMemoryAnalyzerRepositorySeeder,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.packages.package_seeder import (
    InMemoryPackageRepositorySeeder,
)
from pluralscan.data.inmemory.projects.project_repository import (
    InMemoryProjectRepository,
)
from pluralscan.data.inmemory.projects.project_seeder import (
    InMemoryProjectRepositorySeeder,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository


class MemoryContext:
    """Provide a seeded memory database context."""

    def __init__(self) -> None:
        # Initialize and seed Projects store
        self.project_repository: InMemoryProjectRepository = InMemoryProjectRepository()
        InMemoryProjectRepositorySeeder(self.project_repository).seed()

        # Initialize and seed Packages store
        self.package_repository: InMemoryPackageRepository = InMemoryPackageRepository()
        InMemoryPackageRepositorySeeder(self.package_repository).seed()

        # Initialize and seed Analyzers store
        self.analyzer_repository: InMemoryAnalyzerRepository = (
            InMemoryAnalyzerRepository()
        )
        InMemoryAnalyzerRepositorySeeder(self.analyzer_repository).seed()

        # Initialize Scan store
        self.scan_repository: InMemoryScanRepository = InMemoryScanRepository()
