from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import Set

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.technology import Technology
from pluralscan.libs.utils.validable import Validable


# Input
@dataclass(frozen=True)
class NewAnalyzerCommand(Validable):
    """New Analyzer Command"""

    name: str
    technologies: Set[Technology]


# Output
@dataclass(frozen=True)
class NewAnalyzerResult:
    """NewAnalyzerResult"""

    analyzer: Analyzer


# Contract
class AbstractNewAnalyzerUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractNewAnalyzerUseCase"""

    @abstractmethod
    def handle(self, command: NewAnalyzerCommand) -> NewAnalyzerResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class NewAnalyzerUseCase(
    AbstractNewAnalyzerUseCase
):  # pylint: disable=too-few-public-methods
    """NewAnalyzerUseCase"""

    def __init__(self, analyzer_repository: AbstractAnalyzerRepository):
        self._analyzer_repository = analyzer_repository

    def handle(self, command: NewAnalyzerCommand) -> NewAnalyzerResult:
        analyzer_id = self._analyzer_repository.next_id()
        analyzer = Analyzer(analyzer_id, command.name, command.technologies)
        analyzer = self._analyzer_repository.add(analyzer)
        return NewAnalyzerResult(analyzer)
