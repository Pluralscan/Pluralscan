import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    AnalyzerRepositorySeeder
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    ExecutableRepositorySeeder


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def seeder(repository):
    executable_repository = InMemoryExecutableRepository()
    ExecutableRepositorySeeder(executable_repository).seed()
    return AnalyzerRepositorySeeder(repository, executable_repository)


def test_add_entities(
    repository: InMemoryAnalyzerRepository, seeder: AnalyzerRepositorySeeder
):
    # Act
    seeder._add_entities()

    # Assert
    assert repository.count() >= 2


def test_seed(
    repository: InMemoryAnalyzerRepository,
    seeder: AnalyzerRepositorySeeder
):
    # Act
    seeder.seed()

    # Assert
    assert repository.count() >= 2, "at least two analyzers was expected"
