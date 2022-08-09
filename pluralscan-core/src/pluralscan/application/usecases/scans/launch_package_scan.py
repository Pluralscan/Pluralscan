from datetime import datetime
import pathlib
from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunnerFactory,
    ExecRunnerOptions,
)
from pluralscan.application.processors.reports.report_processor import (
    AbstractReportProcessorFactory,
)
from pluralscan.domain.analyzers.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.analyzers.executables.executable import Executable
from pluralscan.domain.analyzers.executables.executable_action import ExecutableAction
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.domain.shared.scans.events.scan_updated_event import ScanUpdatedEvent


@dataclass(frozen=True)
class ScanPackageCommand:
    """Run Analyzer Command"""

    scan_id: ScanId


@dataclass
class ScanPackageResult:
    """Run Analyzer Result"""

    scan: Scan
    executable: Executable
    package: Package


class AbstractScanPackageUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractScanPackageUseCase"""

    @abstractmethod
    def handle(self, command: ScanPackageCommand) -> ScanPackageResult:
        """Execute use case."""
        raise NotImplementedError


class ScanPackageUseCase(
    AbstractScanPackageUseCase
):  # pylint: disable=too-few-public-methods
    """ScanPackageUseCase"""

    def __init__(
        self,
        scan_repository: AbstractScanRepository,
        analyzer_repository: AbstractAnalyzerRepository,
        package_repository: AbstractPackageRepository,
        exec_runner_factory: AbstractExecRunnerFactory,
        report_processor_factory: AbstractReportProcessorFactory,
    ):
        self._scan_repository = scan_repository
        self._analyzer_repository = analyzer_repository
        self._package_repository = package_repository
        self._exec_runner_factory = exec_runner_factory
        self._report_processor_factory = report_processor_factory

    def handle(self, command: ScanPackageCommand) -> ScanPackageResult:
        # 1. Retrieve the scan aggregate.
        scan = self._scan_repository.find_by_id(command.scan_id)
        if scan is None:
            raise ValueError

        # 1.1. Update scan state
        scan.state = ScanState.RUNNING
        scan.started_at = datetime.now()
        scan.add_domain_event(ScanUpdatedEvent(repr(scan.uuid), scan.to_dict()))
        scan = self._scan_repository.update(scan)

        # 2. Retrieve analyzers.
        analyzer = self._analyzer_repository.find_by_id(scan.analyzer_id)
        if analyzer is None:
            raise RuntimeError

        # 2.1. Retrieve executable used to perform code analysis.
        executable = analyzer.find_executable_by_version(scan.executable_version)
        if executable is None:
            raise ValueError

        # 3. Retrieve the package to analyze.
        package = self._package_repository.find_by_id(scan.package_id)
        if package is None:
            raise ValueError

        # 4. Execute analyzer process and wait for list of report files.
        options = ExecRunnerOptions(executable, package, ExecutableAction.SCAN)
        process_result = self._exec_runner_factory.create(
            executable=executable, working_directory=scan.working_directory
        ).execute_with_report(options)
        if process_result.success is not True:
            raise RuntimeError

        # 5. Get list of report files to process.
        report_files = []
        for filepath in pathlib.Path(scan.working_directory).glob("**/*"):
            report_files.append(str(filepath))

        # 6. Transform reports into diagnosis.
        diagnosis = self._report_processor_factory.create(process_result.output_format).transform_to_diagnosis(
            analyzer_id=executable.analyzer_id,
            data=report_files,
        )

        # 7. Update scan
        scan.diagnosis = diagnosis
        scan.ended_at = datetime.now()
        scan.state = ScanState.COMPLETED
        scan.add_domain_event(ScanUpdatedEvent(repr(scan.uuid), scan.to_dict()))
        scan = self._scan_repository.update(scan)

        return ScanPackageResult(scan=scan, package=package, executable=executable)
