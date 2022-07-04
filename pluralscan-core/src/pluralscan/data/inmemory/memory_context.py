from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.data.inmemory.executables.executable_repository import (
    InMemoryExecutableRepository,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.projects.project_repository import (
    InMemoryProjectRepository,
)
from pluralscan.data.inmemory.projects.project_seeder import (
    InMemoryProjectRepositorySeeder,
)


class MemoryContext:
    """Provide a in memory database context."""

    def __init__(self) -> None:
        self.project_repository: InMemoryProjectRepository = InMemoryProjectRepository()
        InMemoryProjectRepositorySeeder(self.project_repository).seed()

        self.package_repository: InMemoryPackageRepository = InMemoryPackageRepository()
        self.analyzer_repository: InMemoryAnalyzerRepository = (
            InMemoryAnalyzerRepository()
        )
        self.executable_repository: InMemoryExecutableRepository = (
            InMemoryExecutableRepository()
        )
