from pluralscan.application.usecases.projects.create_project import (
    AbstractCreateProjectUnitOfWork,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.projects.project_repository import (
    InMemoryProjectRepository,
)


class InMemoryCreateProjectUnitOfWork(AbstractCreateProjectUnitOfWork):
    """InMemoryCreateProjectUnitOfWork"""

    def __init__(
        self,
        project_repository: InMemoryProjectRepository,
        package_repository: InMemoryPackageRepository,
    ) -> None:
        self.project_repository = project_repository
        self.package_repository = package_repository

    def begin(self):
        pass

    def commit(self):
        pass

    def rollback(self):
        pass
