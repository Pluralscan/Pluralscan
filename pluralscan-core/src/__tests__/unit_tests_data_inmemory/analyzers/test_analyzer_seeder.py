import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    AnalyzerInMemoryRepositorySeeder
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    ExecutableInMemoryRepositorySeeder


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def seeder(repository):
    executable_repository = InMemoryExecutableRepository()
    ExecutableInMemoryRepositorySeeder(executable_repository).seed()
    return AnalyzerInMemoryRepositorySeeder(repository, executable_repository)


def test_add_entities(
    repository: InMemoryAnalyzerRepository, seeder: AnalyzerInMemoryRepositorySeeder
):
    # Act
    seeder._add_entities()

    # Assert
    assert repository.count() >= 2


def test_seed(
    repository: InMemoryAnalyzerRepository,
    seeder: AnalyzerInMemoryRepositorySeeder
):
    # Act
    seeder.seed()

    # Assert
    assert repository.count() >= 2, "at least two analyzers was expected"
