import pathlib

import pytest
from __tests__.test_helpers import FIXTURES_DIR
from pluralscan.application.usecases.scans.schredule_scan import (
    SchreduleScanCommand, SchreduleScanUseCase)
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    ExecutableRepositorySeeder
from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.data.inmemory.packages.package_seeder import \
    PackageRepositorySeeder
from pluralscan.data.inmemory.scans.scan_repository import \
    InMemoryScanRepository
from pluralscan.domain.executable.executable_id import ExecutableId
from pluralscan.domain.package.package_origin import PackageOrigin
from pluralscan.infrastructure.processor.fetchers.package_fetcher_factory import \
    PackageFetcherFactory
from pluralscan.infrastructure.processor.jobs.rq_job_runner import RqJobRunner


@pytest.fixture
def scan_repository():
    return InMemoryScanRepository()

@pytest.fixture
def executable_repository():
    executable_repository = InMemoryExecutableRepository()
    ExecutableRepositorySeeder(executable_repository).seed()
    return executable_repository

@pytest.fixture
def package_repository():
    package_repository = InMemoryPackageRepository()
    PackageRepositorySeeder(package_repository).seed()
    return package_repository


def test_handle_for_unregistred_package(scan_repository, package_repository, executable_repository):
    # Arrange
    uri = str(pathlib.Path.joinpath(FIXTURES_DIR, "csharp/" "Analyzers.Tests.Old.zip"))
    executables = [ExecutableId("RoslynatorFork")]
    working_directory = FIXTURES_DIR

    command = SchreduleScanCommand(
        uri,
        executables,
        working_directory,
    )
    
    usecase = SchreduleScanUseCase(
        scan_repository=scan_repository,
        package_repository=package_repository,
        executable_repository=executable_repository,
        package_fetcher_factory=PackageFetcherFactory(),
        job_runner=RqJobRunner()
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
