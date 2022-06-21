from dataclasses import dataclass, field
from abc import ABCMeta, abstractmethod
import os
from typing import Tuple
from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
)
from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner,
    ExecRunnerOptions,
)
from pluralscan.application.processors.reports.report_processor import (
    AbstractReportProcessor,
)
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.analyzer.analyzer_target import AnalyzerTarget
from pluralscan.domain.diagnosys.diagnosys import Diagnosys
from pluralscan.libs.utils.validable import Validable


@dataclass(frozen=True)
class ScanRemotePackageCommand(Validable):
    """Run Analyzer Command"""

    url: str
    analyzer_id: AnalyzerId
    executable_version: str
    output_path: str
    executable_arguments: frozenset[Tuple[str, str]] = field(default_factory=frozenset)
    """If filled, the arguments will be combined with the excutable default arguments."""

    def __post_init__(self):
        if not self.analyzer_id:
            raise ValueError("An analyzer id must be defined.")
        if not self.url:
            raise ValueError("An url must be defined.")


@dataclass
class ScanRemotePackageResult:
    """Run Analyzer Result"""

    diagnosys: Diagnosys


class AbstractScanRemotePackageUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractScanRemotePackageUseCase"""

    @abstractmethod
    def handle(
        self, command: ScanRemotePackageCommand
    ) -> ScanRemotePackageResult:
        """Execute use case."""
        raise NotImplementedError


class ScanRemotePackageUseCase(
    AbstractScanRemotePackageUseCase
):  # pylint: disable=too-few-public-methods
    """ScanRemotePackageUseCase"""

    def __init__(
        self,
        package_fetcher: AbstractPackageFetcher,
        analyzer_repository: AbstractAnalyzerRepository,
        exec_runner: AbstractExecRunner,
        report_processor: AbstractReportProcessor,
    ):
        self._package_fetcher = package_fetcher
        self._analyzer_repository = analyzer_repository
        self._exec_runner = exec_runner
        self._report_processor = report_processor

    def handle(
        self, command: ScanRemotePackageCommand
    ) -> ScanRemotePackageResult:
        # Retrieve static code analyzer.
        analyzer = self._analyzer_repository.find_by_id(command.analyzer_id)
        if analyzer is None:
            raise ValueError

        # Ensure the analyzer can process a package.
        if self.can_analyze_package(analyzer) is False:
            raise RuntimeError("The provided analyzer can't handle packages.")

        # Retrieve analyzer executable.
        executable = analyzer.get_executable_by_version(command.executable_version)
        if executable is None:
            raise RuntimeError("No executable found for provided version.")

        # Download package
        download_result = self._package_fetcher.download(command.url)
        if download_result.success is not True:
            raise RuntimeError(download_result.error)

        # Execute analyzer process and wait for list of report files.
        options = ExecRunnerOptions(executable, command.executable_arguments)
        process_result = self._exec_runner.execute_with_report(options)
        if process_result.success is not True:
            raise RuntimeError

        # Get list of report files.
        report_files = os.listdir(command.output_path)

        # Transform reports into dianosys.
        diagnosys = self._report_processor.transform_to_diagnosys(report_files)

        return ScanRemotePackageResult(diagnosys)

    @classmethod
    def can_analyze_package(cls, analyzer: Analyzer) -> bool:
        """Check if the provided analyzer can analyze package."""
        if AnalyzerTarget.PACKAGE in analyzer.supported_targets:
            return True
        return False
