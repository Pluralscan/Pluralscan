from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner
from cleansecpy.domain.analyzer.analyzer_repository import AnalyzerRepository
from cleansecpy.domain.diagnosys.diagnosys import Diagnosys


@dataclass(frozen=True)
class AnalyzeSourceCommand:
    """Analyze Package Command"""
    package_id: str
    analyze_id: str
    results_dir: str


@dataclass
class AnalyzeSourceResult:
    """AnalyzeSourceResult"""
    diagnosys: Diagnosys = None


class AbstractAnalyzeSourceUseCase(metaclass=ABCMeta):
    """AbstractAnalyzeSourceUseCase"""
    @abstractmethod
    def handle(self, command: AnalyzeSourceCommand) -> AnalyzeSourceResult:
        """handle"""
        raise NotImplementedError


class AnalyzeSourceeUseCase(AbstractAnalyzeSourceUseCase):
    """AnalyzeSourceeUseCase"""

    def __init__(self,
                 analyzer_repository: AnalyzerRepository,
                 process_runner: AbstractProcessRunner):
        self._analyzer_repository = analyzer_repository
        self._process_runner = process_runner

    def handle(self, command: AnalyzeSourceCommand) -> AnalyzeSourceResult:
        return AnalyzeSourceResult()
