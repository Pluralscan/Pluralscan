from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.language import Language


# Input
@dataclass(frozen=True)
class GetAnalyzersByLanguageCommand:
    """List Analyzer Command"""

    language: Language


# Output
@dataclass(frozen=True)
class GetAnalyzersByLanguageResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractGetAnalyzersByLanguageUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetAnalyzerListUseCase"""

    @abstractmethod
    def handle(self, command: GetAnalyzersByLanguageCommand) -> GetAnalyzersByLanguageResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetAnalyzersByLanguageUseCase(
    AbstractGetAnalyzersByLanguageUseCase
):  # pylint: disable=too-few-public-methods
    """GetAnalyzerListUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: GetAnalyzersByLanguageCommand) -> GetAnalyzersByLanguageResult:
        analyzers = self._analyzer_repository.find_by_supported_language(command.language)
        return GetAnalyzersByLanguageResult(analyzers)
