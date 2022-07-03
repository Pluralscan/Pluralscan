import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    InMemoryAnalyzerRepositorySeeder
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    InMemoryExecutableRepositorySeeder


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def seeder(repository):
    executable_repository = InMemoryExecutableRepository()
    InMemoryExecutableRepositorySeeder(executable_repository).seed()
    return InMemoryAnalyzerRepositorySeeder(repository, executable_repository)


def test_add_entities(
    repository: InMemoryAnalyzerRepository, seeder: InMemoryAnalyzerRepositorySeeder
):
    # Act
    seeder._add_entities()

    # Assert
    assert repository.count() >= 2


def test_seed(
    repository: InMemoryAnalyzerRepository,
    seeder: InMemoryAnalyzerRepositorySeeder
):
    # Act
    seeder.seed()

    # Assert
    assert repository.count() >= 2, "at least two analyzers was expected"
