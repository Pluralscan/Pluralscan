import calendar
from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
import os
import time
from cleansecpy import REPORTS_DIR, SOURCES_DIR
from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner, ProcessOptions
from cleansecpy.application.processor.report.report_processor import AbstractReportProcessor
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_repository import AnalyzerRepository
from cleansecpy.domain.analyzer.analyzer_target import AnalyzerTarget
from cleansecpy.domain.diagnosys.diagnosys import Diagnosys
from cleansecpy.domain.package.package_repository import PackageRepository
from cleansecpy.libs.utils.validable import Validable


@dataclass(frozen=True)
class AnalyzePackageCommand(Validable):
    """Run Analyzer Command"""
    package_id: str
    analyzer_id: str
    executable_version: str
    output_path: str

    def __post_init__(self):
        if not self.analyzer_id:
            raise ValueError("An analyzer id must be defined.")
        if not self.package_id:
            raise ValueError("A package id must be defined.")


@dataclass
class AnalyzePackageResult:
    """Run Analyzer Result"""
    diagnosys: Diagnosys


class AbstractAnalyzePackageUseCase(metaclass=ABCMeta):  # pylint: disable=too-few-public-methods
    """AbstractRunAnalyzerUseCase"""
    @abstractmethod
    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        """Execute use case."""
        raise NotImplementedError


class AnalyzePackageUseCase(AbstractAnalyzePackageUseCase):  # pylint: disable=too-few-public-methods
    """AnalyzePackageUseCase"""

    def __init__(self,
                 package_repository: PackageRepository,
                 analyzer_repository: AnalyzerRepository,
                 process_runner: AbstractProcessRunner,
                 report_processor: AbstractReportProcessor):
        self._package_repository = package_repository
        self._analyzer_repository = analyzer_repository
        self._process_runner = process_runner
        self._report_processor = report_processor

    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        analyzer = self._analyzer_repository.find_by_id(command.analyzer_id)
        if analyzer is None:
            raise ValueError
        if self.can_analyze_package(analyzer) is False:
            raise RuntimeError("The provided analyzer can't handle packages.")

        executable = analyzer.get_executable_by_version(
            command.executable_version)

        if executable is None:
            raise RuntimeError("No executable found for provided version.")

        package = self._package_repository.find_by_id(command.package_id)
        if package is None:
            raise ValueError

        extra_arguments = [('analyze', package.location),
                           ('-o', command.output_path)]
        options = ProcessOptions(executable, command.output_path, extra_arguments)

        process_result = self._process_runner.execute_with_report(options)
        diagnosys = self._report_processor.transform_to_diagnosys(process_result.output_files)

        return AnalyzePackageResult(diagnosys)

    @classmethod
    def can_analyze_package(cls, analyzer: Analyzer) -> bool:
        """Check if the provided analyzer can analyze package."""
        if AnalyzerTarget.PACKAGE in analyzer.supported_targets:
            return True
        return False
