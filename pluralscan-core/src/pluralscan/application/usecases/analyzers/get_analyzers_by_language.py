from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.technology import Technology


# Input
@dataclass(frozen=True)
class GetAnalyzersByTechnologyCommand:
    """List Analyzer Command"""

    language: Technology


# Output
@dataclass(frozen=True)
class GetAnalyzersByTechnologyResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractGetAnalyzersByTechnologyUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetAnalyzerListUseCase"""

    @abstractmethod
    def handle(self, command: GetAnalyzersByTechnologyCommand) -> GetAnalyzersByTechnologyResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetAnalyzersByTechnologyUseCase(
    AbstractGetAnalyzersByTechnologyUseCase
):  # pylint: disable=too-few-public-methods
    """GetAnalyzerListUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: GetAnalyzersByTechnologyCommand) -> GetAnalyzersByTechnologyResult:
        analyzers = self._analyzer_repository.find_by_supported_language(command.language)
        return GetAnalyzersByTechnologyResult(analyzers)
