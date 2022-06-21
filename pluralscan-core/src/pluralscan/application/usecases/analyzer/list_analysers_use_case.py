from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.libs.utils.validable import Validable

# Input
@dataclass(frozen=True)
class ListAnalyzersCommand(Validable):
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class ListAnalyzersResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractListAnalyzersUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListAnalyzerUseCase"""

    @abstractmethod
    def handle(self, command: ListAnalyzersCommand) -> ListAnalyzersResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class ListAnalyzersUseCase(
    AbstractListAnalyzersUseCase
):  # pylint: disable=too-few-public-methods
    """NewAnalyzerUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: ListAnalyzersCommand) -> ListAnalyzersResult:
        analyzers = self._analyzer_repository.get_all()
        return ListAnalyzersResult(analyzers)
