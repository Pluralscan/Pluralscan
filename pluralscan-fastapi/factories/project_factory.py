from pluralscan.application.usecases.projects.create_project import CreateProjectUseCase
from pluralscan.application.usecases.projects.get_project import FindProjectUseCase
from pluralscan.application.usecases.projects.get_project_list import GetProjectListUseCase
from pluralscan.data.inmemory.projects.project_uow import InMemoryCreateProjectUnitOfWork
from pluralscan.infrastructure.processor.fetchers.projects.project_fetcher_factory import ProjectFetcherFactory
from configs.database import MEMORY_CONTEXT

def memory_project_repository():
    """memory_project_repository"""
    return MEMORY_CONTEXT.project_repository


def memory_create_project_uow():
    """memory_create_project_uow"""
    return InMemoryCreateProjectUnitOfWork(
        MEMORY_CONTEXT.project_repository, MEMORY_CONTEXT.package_repository
    )


def project_fetcher_factory():
    """project_fetcher_factory"""
    return ProjectFetcherFactory()


# Project Use Cases
def find_project_use_case():
    """find_project_use_case"""
    return FindProjectUseCase(memory_project_repository())


def get_project_list_use_case():
    """get_project_list_use_case"""
    return GetProjectListUseCase(memory_project_repository())


def create_project_use_case():
    """create_project_use_case"""
    return CreateProjectUseCase(project_fetcher_factory(), memory_create_project_uow())
