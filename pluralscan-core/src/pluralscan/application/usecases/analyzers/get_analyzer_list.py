from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository


# Input
@dataclass(frozen=True)
class GetAnalyzerListCommand:
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class GetAnalyzerListResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractGetAnalyzerListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetAnalyzerListUseCase"""

    @abstractmethod
    def handle(self, command: GetAnalyzerListCommand) -> GetAnalyzerListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetAnalyzerListUseCase(
    AbstractGetAnalyzerListUseCase
):  # pylint: disable=too-few-public-methods
    """GetAnalyzerListUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: GetAnalyzerListCommand) -> GetAnalyzerListResult:
        analyzers = self._analyzer_repository.find_all()
        return GetAnalyzerListResult(analyzers)
