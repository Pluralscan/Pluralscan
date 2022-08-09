import pytest
from pluralscan.application.usecases.scans.launch_package_scan import (
    ScanPackageCommand,
    ScanPackageUseCase,
)
from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.data.inmemory.analyzers.analyzer_seeder import (
    InMemoryAnalyzerRepositorySeeder,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.packages.package_seeder import (
    InMemoryPackageRepositorySeeder,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository
from pluralscan.data.inmemory.scans.scan_seeder import ScanRepositorySeeder
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.infrastructure.processor.executables.exec_runner_factory import (
    ExecRunnerFactory,
)
from pluralscan.infrastructure.processor.reports.report_processor_factory import (
    ReportProcessorFactory,
)


@pytest.fixture
def package_repository():
    repository = InMemoryPackageRepository()
    InMemoryPackageRepositorySeeder(repository).seed()
    return repository


@pytest.fixture
def analyzer_repository():
    repository = InMemoryAnalyzerRepository()
    InMemoryAnalyzerRepositorySeeder(repository).seed()
    return repository


@pytest.fixture
def context(package_repository, analyzer_repository):
    scan_repository = InMemoryScanRepository()
    ScanRepositorySeeder(
        package_repository, scan_repository
    ).seed()
    return {
        "packages": package_repository,
        "analyzers": analyzer_repository,
        "scans": scan_repository,
    }


def test_handle_with_roslynator(context):
    # Arrange
    command = ScanPackageCommand(scan_id=ScanId("TestScheduled"))

    usecase = ScanPackageUseCase(
        scan_repository=context["scans"],
        package_repository=context["packages"],
        analyzer_repository=context["analyzers"],
        exec_runner_factory=ExecRunnerFactory(),
        report_processor_factory=ReportProcessorFactory(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
    assert result.scan.state is ScanState.COMPLETED


def test_handle_go_with_dependency_check(context):
    # Arrange
    command = ScanPackageCommand(scan_id=ScanId("gat"))

    usecase = ScanPackageUseCase(
        scan_repository=context["scans"],
        package_repository=context["packages"],
        analyzer_repository=context["analyzers"],
        exec_runner_factory=ExecRunnerFactory(),
        report_processor_factory=ReportProcessorFactory(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
    assert result.scan.state is ScanState.COMPLETED


def test_handle_rust_with_clippy(context):
    # Arrange
    command = ScanPackageCommand(scan_id=ScanId("machin"))

    usecase = ScanPackageUseCase(
        scan_repository=context["scans"],
        package_repository=context["packages"],
        analyzer_repository=context["analyzers"],
        exec_runner_factory=ExecRunnerFactory(),
        report_processor_factory=ReportProcessorFactory(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
    assert result.scan.state is ScanState.COMPLETED