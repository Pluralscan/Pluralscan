from pluralscan.application.usecases.projects.create_project import \
    AbstractCreateProjectUnitOfWork
from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.data.inmemory.projects.project_repository import \
    InMemoryProjectRepository


class InMemoryCreateProjectUnitOfWork(AbstractCreateProjectUnitOfWork):
    """InMemoryCreateProjectUnitOfWork"""
    def __init__(self) -> None:
        self.project_repository = InMemoryProjectRepository()
        self.package_repository = InMemoryPackageRepository()

    def begin(self):
        pass

    def commit(self):
        pass

    def rollback(self):
        pass
