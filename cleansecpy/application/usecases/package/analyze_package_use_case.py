from dataclasses import dataclass, field
from abc import ABCMeta, abstractmethod
import os
from typing import Tuple

from cleansecpy.application.processor.executables.exec_runner import (
    AbstractExecRunner,
    ExecRunnerOptions,
)
from cleansecpy.application.processor.reports.report_processor import (
    AbstractReportProcessor,
)
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from cleansecpy.domain.analyzer.analyzer_target import AnalyzerTarget
from cleansecpy.domain.diagnosys.diagnosys import Diagnosys
from cleansecpy.domain.package.package_id import PackageId
from cleansecpy.domain.package.package_repository import AbstractPackageRepository
from cleansecpy.libs.utils.validable import Validable


@dataclass(frozen=True)
class AnalyzePackageCommand(Validable):
    """Run Analyzer Command"""

    package_id: PackageId
    analyzer_id: AnalyzerId
    executable_version: str
    output_path: str
    executable_arguments: frozenset[Tuple[str, str]] = field(default_factory=frozenset)
    """If filled, the arguments will be combined with the excutable default arguments."""

    def __post_init__(self):
        if not self.analyzer_id:
            raise ValueError("An analyzer id must be defined.")
        if not self.package_id:
            raise ValueError("A package id must be defined.")


@dataclass
class AnalyzePackageResult:
    """Run Analyzer Result"""

    diagnosys: Diagnosys


class AbstractAnalyzePackageUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractRunAnalyzerUseCase"""

    @abstractmethod
    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        """Execute use case."""
        raise NotImplementedError


class AnalyzePackageUseCase(
    AbstractAnalyzePackageUseCase
):  # pylint: disable=too-few-public-methods
    """AnalyzePackageUseCase"""

    def __init__(
        self,
        package_repository: AbstractPackageRepository,
        analyzer_repository: AbstractAnalyzerRepository,
        exec_runner: AbstractExecRunner,
        report_processor: AbstractReportProcessor,
    ):
        self._package_repository = package_repository
        self._analyzer_repository = analyzer_repository
        self._exec_runner = exec_runner
        self._report_processor = report_processor

    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        # 1. Retrieve code analyzer.
        analyzer = self._analyzer_repository.find_by_id(command.analyzer_id)
        if analyzer is None:
            raise ValueError

        # 1.1 Ensure the analyzer can process a package scan.
        if self.can_analyze_package(analyzer) is False:
            raise RuntimeError("The provided analyzer can't handle packages.")

        # 2. Retrieve analyzer executable.
        executable = analyzer.get_executable_by_version(command.executable_version)
        if executable is None:
            raise RuntimeError("No executable found for provided version.")

        # 3. Retrieve the package to analyze.
        package = self._package_repository.find_by_id(command.package_id)
        if package is None:
            raise ValueError

        # 4. Execute analyzer process and wait for list of report files.
        options = ExecRunnerOptions(executable, command.executable_arguments)
        process_result = self._exec_runner.execute_with_report(options)
        if process_result.success is not True:
            raise RuntimeError

        # 5. Get list of report files.
        report_files = os.listdir(command.output_path)

        # 6. Transform reports into dianosys.
        diagnosys = self._report_processor.transform_to_diagnosys(report_files)

        return AnalyzePackageResult(diagnosys)

    @classmethod
    def can_analyze_package(cls, analyzer: Analyzer) -> bool:
        """Check if the provided analyzer can analyze package."""
        if AnalyzerTarget.PACKAGE in analyzer.supported_targets:
            return True
        return False
