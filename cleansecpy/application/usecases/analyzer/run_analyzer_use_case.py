from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List
from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner
from cleansecpy.domain.analyzer.analyzer_repository import AnalyzerRepository
from cleansecpy.domain.common.scan_target import ScanTarget
from cleansecpy.domain.filesytem.file import File
from cleansecpy.libs.utils.validable import Validable


@dataclass(frozen=True)
class RunAnalyzerCommand(Validable):
    """Run Analyzer Command"""
    analyzer_id: str
    arguments: List[str]
    scan_target: ScanTarget


@dataclass
class RunAnalyzerResult:
    """Run Analyzer Result"""
    result_file: File


class AbstractRunAnalyzerUseCase(metaclass=ABCMeta):  # pylint: disable=too-few-public-methods
    """AbstractRunAnalyzerUseCase"""
    @abstractmethod
    def handle(self, command: RunAnalyzerCommand) -> RunAnalyzerResult:
        """Execute use case."""
        raise NotImplementedError


class RunAnalyzerUseCase(AbstractRunAnalyzerUseCase):  # pylint: disable=too-few-public-methods
    """RunAnalyzerUseCase"""

    def __init__(self,
                 analyzer_repository: AnalyzerRepository,
                 process_runner: AbstractProcessRunner):
        self._analyzer_repository = analyzer_repository
        self._process_runner = process_runner

    def handle(self, command: RunAnalyzerCommand) -> RunAnalyzerResult:
        analyzer = self._analyzer_repository.find_by_id(command.analyzer_id)

        return RunAnalyzerResult(analyzer)
