from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_repository import AbstractProjectRepository
from pluralscan.libs.ddd.repositories.pagination import Pageable


# Input
@dataclass(frozen=True)
class GetProjectListQuery:
    """Query parameters used for fetch list of projects."""

    page: int = 1
    """
    Page number (default: 1).
    """

    limit: int = 15
    """
    The number of analyzers to return per page,
    up to a maximum of 100 (default: 15).
    """


# Output
@dataclass(frozen=True)
class GetProjectListResult:
    """GetProjectListResult"""

    projects: List[Project]
    item_count: int
    page_index: int
    page_count: int
    page_size: int


# Contract
class AbstractGetProjectListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetProjectListUseCase"""

    @abstractmethod
    def handle(self, query: GetProjectListQuery) -> GetProjectListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetProjectListUseCase(
    AbstractGetProjectListUseCase
):  # pylint: disable=too-few-public-methods
    """GetProjectListUseCase"""

    def __init__(self, project_repository: AbstractProjectRepository):
        self._project_repository = project_repository

    def handle(self, query: GetProjectListQuery) -> GetProjectListResult:
        page = self._project_repository.find_all(Pageable(query.page, query.limit))

        return GetProjectListResult(
            projects=page.items,
            item_count=page.total_items,
            page_index=page.page_number,
            page_count=page.total_pages,
            page_size=page.page_size,
        )
