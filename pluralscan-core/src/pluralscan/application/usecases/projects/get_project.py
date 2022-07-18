from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import Optional


from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_repository import AbstractProjectRepository
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class FindProjectQuery:
    """FindProjectQuery"""
    source: str
    namespace: str


@dataclass
class FindProjectQueryResult:
    """CreateProjectResult"""

    project: Optional[Project]


class AbstractFindProjectUseCase(metaclass=ABCMeta):
    """AbstractFindProjectUseCase"""

    @abstractmethod
    def handle(self, query: FindProjectQuery) -> FindProjectQueryResult:
        """handle"""
        raise NotImplementedError


class FindProjectUseCase(AbstractFindProjectUseCase):
    """FindProjectUseCase"""

    def __init__(
        self,
        project_repository: AbstractProjectRepository,
    ) -> None:
        self._project_repository = project_repository

    def handle(self, query: FindProjectQuery) -> FindProjectQueryResult:
        # Find a project in internal system.
        project = self._project_repository.find_one(query.namespace, ProjectSource.from_str(query.source))

        return FindProjectQueryResult(project=project)
