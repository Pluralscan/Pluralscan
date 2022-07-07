from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.technology import Technology


# Input
@dataclass(frozen=True)
class FiendAnalyzersByTechnologyCommand:
    """List Analyzer Command"""

    technology: Technology


# Output
@dataclass(frozen=True)
class FindAnalyzersByTechnologyResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractFindAnalyzersByTechnologyUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractFindAnalyzersByTechnologyUseCase"""

    @abstractmethod
    def handle(self, command: FiendAnalyzersByTechnologyCommand) -> FindAnalyzersByTechnologyResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class FindAnalyzersByTechnologyUseCase(
    AbstractFindAnalyzersByTechnologyUseCase
):  # pylint: disable=too-few-public-methods
    """FindAnalyzersByTechnologyUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: FiendAnalyzersByTechnologyCommand) -> FindAnalyzersByTechnologyResult:
        analyzers = self._analyzer_repository.find_by_technology(command.technology)
        return FindAnalyzersByTechnologyResult(analyzers)
