from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, field
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.technology import Technology


# Input
@dataclass(frozen=True)
class FindAnalyzersByTechnologiesQuery:
    """FindAnalyzersByTechnologiesQuery"""

    technologies: List[Technology] = field(default_factory=list)


# Output
@dataclass(frozen=True)
class FindAnalyzersByTechnologiesResult:
    """ListAnalyzerResult"""

    analyzers: List[Analyzer]


# Contract
class AbstractFindAnalyzersByTechnologiesUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractFindAnalyzersByTechnologiesUseCase"""

    @abstractmethod
    def handle(self, query: FindAnalyzersByTechnologiesQuery) -> FindAnalyzersByTechnologiesResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class FindAnalyzersByTechnologiesUseCase(
    AbstractFindAnalyzersByTechnologiesUseCase
):  # pylint: disable=too-few-public-methods
    """FindAnalyzersByTechnologiesUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, query: FindAnalyzersByTechnologiesQuery) -> FindAnalyzersByTechnologiesResult:
        analyzers = self._analyzer_repository.find_by_technologies(query.technologies)
        return FindAnalyzersByTechnologiesResult(analyzers)
