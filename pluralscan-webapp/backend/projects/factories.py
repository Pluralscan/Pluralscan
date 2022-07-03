from pluralscan.application.usecases.projects.create_project import CreateProjectUseCase
from pluralscan.application.usecases.projects.find_project_by_uri import (
    FindProjectByUriUseCase,
)
from pluralscan.application.usecases.projects.get_project_list import (
    GetProjectListUseCase,
)
from pluralscan.data.inmemory.projects.project_repository import (
    InMemoryProjectRepository,
)
from pluralscan.data.inmemory.projects.project_uow import InMemoryCreateProjectUnitOfWork
from pluralscan.infrastructure.processor.fetchers.projects.project_fetcher_factory import (
    ProjectFetcherFactory,
)


def memory_project_repository():
    """memory_project_repository"""
    project_repository = InMemoryProjectRepository()
    return project_repository

def memory_create_project_uow():
    """memory_create_project_uow"""
    return InMemoryCreateProjectUnitOfWork()


def project_fetcher_factory():
    """project_fetcher_factory"""
    return ProjectFetcherFactory()


# Project Use Cases
def find_project_by_uri():
    """find_project_by_uri"""
    return FindProjectByUriUseCase(
        project_fetcher_factory(), memory_project_repository()
    )


def get_project_list():
    """get_project_list"""
    return GetProjectListUseCase(memory_project_repository())

def create_project():
    """create_project"""
    return CreateProjectUseCase(project_fetcher_factory(), memory_create_project_uow())