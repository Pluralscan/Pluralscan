import pytest
from __tests__.test_helpers import FIXTURES_DIR
from pluralscan.application.usecases.scans.schedule_scan import (
    ScheduleScanCommand, ScheduleScanUseCase)
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
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.infrastructure.processor.jobs.rq_job_runner import RqJobRunner


@pytest.fixture
def scan_repository():
    return InMemoryScanRepository()


@pytest.fixture
def executable_repository():
    executable_repository = InMemoryExecutableRepository()
    InMemoryExecutableRepositorySeeder(executable_repository).seed()
    return executable_repository


@pytest.fixture
def package_repository():
    package_repository = InMemoryPackageRepository()
    InMemoryPackageRepositorySeeder(package_repository).seed()
    return package_repository


def test_handle(scan_repository, package_repository, executable_repository):
    # Arrange
    package_id = PackageId("AnalyzerTests")
    executables = [ExecutableId("RoslynatorFork")]
    working_directory = FIXTURES_DIR

    command = ScheduleScanCommand(
        package_id=package_id,
        executables=executables,
        working_directory=working_directory,
    )

    usecase = ScheduleScanUseCase(
        scan_repository=scan_repository,
        package_repository=package_repository,
        executable_repository=executable_repository,
        job_runner=RqJobRunner(),
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
