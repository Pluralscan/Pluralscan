import pytest
from __tests__.test_helpers import FIXTURES_DIR
from pluralscan.application.usecases.scans.schedule_package_scan import (
    ScheduleScanCommand,
    ScheduleScanUseCase,
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
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.infrastructure.processor.jobs.rq_job_runner import RqJobRunner


@pytest.fixture
def scan_repository():
    return InMemoryScanRepository()


@pytest.fixture
def package_repository():
    package_repository = InMemoryPackageRepository()
    InMemoryPackageRepositorySeeder(package_repository).seed()
    return package_repository


@pytest.fixture
def analyzer_repository():
    analyzer_repository = InMemoryAnalyzerRepository()
    InMemoryAnalyzerRepositorySeeder(analyzer_repository).seed()
    return analyzer_repository


def test_handle(scan_repository, package_repository, analyzer_repository):
    # Arrange
    package_id = PackageId("AnalyzerTests")
    analyzers = { AnalyzerId("Roslynator"):["0.3.3.0F"] }
    working_directory = FIXTURES_DIR

    command = ScheduleScanCommand(
        package_id=package_id,
        analyzers=analyzers,
        working_directory=working_directory,
    )

    usecase = ScheduleScanUseCase(
        scan_repository=scan_repository,
        package_repository=package_repository,
        analyzer_repository=analyzer_repository,
        job_runner=RqJobRunner(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
