from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import Optional

from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher, AbstractProjectFetcherFactory)
from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_repository import \
    AbstractProjectRepository


@dataclass
class FindProjectByUriQuery:
    """CreateProjectCommand"""

    uri: str


@dataclass
class FindProjectByUriResult:
    """CreateProjectResult"""

    project: Optional[Project]


class AbstractFindProjectByUriUseCase(metaclass=ABCMeta):
    """AbstractFindProjectUseCase"""

    @abstractmethod
    def handle(self, query: FindProjectByUriQuery) -> FindProjectByUriResult:
        """handle"""
        raise NotImplementedError


class FindProjectByUriUseCase(AbstractFindProjectByUriUseCase):
    """FindProjectByUriUseCase"""

    def __init__(
        self,
        project_fetcher_factory: AbstractProjectFetcherFactory,
        project_repository: AbstractProjectRepository,
    ) -> None:
        self._project_fetcher_factory = project_fetcher_factory
        self._project_repository = project_repository

    def handle(self, query: FindProjectByUriQuery) -> FindProjectByUriResult:
        # Create the appropriate project fetcher.
        project_fetcher: AbstractProjectFetcher = self._project_fetcher_factory.create(
            query.uri
        )

        # Fetch package info.
        project_info = project_fetcher.get_info(query.uri)

        # Find a project in internal registry.
        project = self._project_repository.find_one(
            project_info.name, project_info.source
        )

        return FindProjectByUriResult(project=project)
