import pytest
from pluralscan.application.usecases.scans.run_scan import (ScanPackageCommand,
                                                            ScanPackageUseCase)
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.diagnosis.diagnosis_repository import \
    InMemoryDiagnosisRepository
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    InMemoryExecutableRepositorySeeder
from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.data.inmemory.packages.package_seeder import \
    InMemoryPackageRepositorySeeder
from pluralscan.data.inmemory.scans.scan_repository import \
    InMemoryScanRepository
from pluralscan.data.inmemory.scans.scan_seeder import ScanRepositorySeeder
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.infrastructure.processor.executables.exec_runner_factory import \
    ExecRunnerFactory
from pluralscan.infrastructure.processor.reports.roslynator_report_processor import \
    RoslynatorReportProcessor


@pytest.fixture
def package_repository():
    repository = InMemoryPackageRepository()
    InMemoryPackageRepositorySeeder(repository).seed()
    return repository


@pytest.fixture
def executable_repository():
    repository = InMemoryExecutableRepository()
    InMemoryExecutableRepositorySeeder(repository).seed()
    return repository


@pytest.fixture
def analyzer_repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def diagnosis_repository():
    return InMemoryDiagnosisRepository()


@pytest.fixture
def context(package_repository, executable_repository, diagnosis_repository):
    scan_repository = InMemoryScanRepository()
    ScanRepositorySeeder(
        package_repository, executable_repository, scan_repository
    ).seed()
    return {
        "packages": package_repository,
        "executables": executable_repository,
        "scans": scan_repository,
        "diagnosis": diagnosis_repository,
    }


def test_handle_with_roslynator(context):
    # Arrange
    command = ScanPackageCommand(
        scan_id=ScanId("TestScheduled")
    )

    usecase = ScanPackageUseCase(
        scan_repository=context["scans"],
        package_repository=context["packages"],
        executable_repository=context["executables"],
        diagnosis_repository=context["diagnosis"],
        exec_runner_factory=ExecRunnerFactory(),
        report_processor=RoslynatorReportProcessor(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
    assert result.scan.state is ScanState.COMPLETED
