from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.libs.ddd.repositories.pagination import Pageable


# Input
@dataclass(frozen=True)
class GetAnalyzerListQuery:
    """List Analyzer Query"""

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
class GetAnalyzerListResult:
    """GetAnalyzerListResult"""

    analyzers: List[Analyzer]
    item_count: int
    page_index: int
    page_count: int
    page_size: int


# Contract
class AbstractGetAnalyzerListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetAnalyzerListUseCase"""

    @abstractmethod
    def handle(self, query: GetAnalyzerListQuery) -> GetAnalyzerListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetAnalyzerListUseCase(
    AbstractGetAnalyzerListUseCase
):  # pylint: disable=too-few-public-methods
    """GetAnalyzerListUseCase"""

    def __init__(
        self,
        analyzer_repository: AbstractAnalyzerRepository,
    ):
        self._analyzer_repository = analyzer_repository

    def handle(self, query: GetAnalyzerListQuery) -> GetAnalyzerListResult:
        page = self._analyzer_repository.find_all(Pageable(query.page, query.limit))

        return GetAnalyzerListResult(
            analyzers=page.items,
            item_count=page.total_items,
            page_index=page.page_number,
            page_count=page.total_pages,
            page_size=page.page_size,
        )
