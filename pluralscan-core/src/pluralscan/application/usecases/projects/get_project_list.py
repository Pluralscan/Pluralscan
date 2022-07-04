from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_repository import \
    AbstractProjectRepository


# Input
@dataclass(frozen=True)
class GetProjectListQuery:
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class GetProjectListResult:
    """ListAnalyzerResult"""

    projects: List[Project]


# Contract
class AbstractGetProjectListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetProjectListUseCase"""

    @abstractmethod
    def handle(self, command: GetProjectListQuery) -> GetProjectListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetProjectListUseCase(
    AbstractGetProjectListUseCase
):  # pylint: disable=too-few-public-methods
    """GetProjectListUseCase"""

    def __init__(self, project_repository: AbstractProjectRepository):
        self._project_repository = project_repository

    def handle(self, _: GetProjectListQuery) -> GetProjectListResult:
        projects = self._project_repository.find_all()
        return GetProjectListResult(projects)
