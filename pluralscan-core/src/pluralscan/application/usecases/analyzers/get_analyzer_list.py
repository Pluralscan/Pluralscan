from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.executables.executable_repository import (
    AbstractExecutableRepository,
)
from pluralscan.libs.ddd.repositories.pagination import Pageable


# Input
@dataclass(frozen=True)
class GetAnalyzerListQuery:
    """List Analyzer Query"""

    offset: int = 0
    limit: int = 100


# Output
@dataclass(frozen=True)
class GetAnalyzerListResult:
    """GetAnalyzerListResult"""

    analyzers: List[Analyzer]
    total_items: int
    page_number: int
    total_page: int
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
        executable_repository: AbstractExecutableRepository,
    ):
        self._analyzer_repository = analyzer_repository
        self._executable_repository = executable_repository

    def handle(self, query: GetAnalyzerListQuery) -> GetAnalyzerListResult:
        page = self._analyzer_repository.find_all(Pageable(query.offset, query.limit))

        for analyzer in page.items:
            analyzer.executables = self._executable_repository.find_by_analyzer(
                analyzer.analyzer_id
            )

        return GetAnalyzerListResult(
            analyzers=page.items,
            total_items=page.total_items,
            page_number=page.page_number,
            total_page=page.total_pages,
            page_size=query.limit,
        )
