from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from cleansecpy.libs.utils.validable import Validable

# Input
@dataclass(frozen=True)
class ListAnalyzerCommand(Validable):
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class ListAnalyzerResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractListAnalyzerUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListAnalyzerUseCase"""

    @abstractmethod
    def handle(self, command: ListAnalyzerCommand) -> ListAnalyzerResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class ListAnalyzerUseCase(
    AbstractListAnalyzerUseCase
):  # pylint: disable=too-few-public-methods
    """NewAnalyzerUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: ListAnalyzerCommand) -> ListAnalyzerResult:
        analyzers = self._analyzer_repository.get_all()
        return ListAnalyzerResult(analyzers)
