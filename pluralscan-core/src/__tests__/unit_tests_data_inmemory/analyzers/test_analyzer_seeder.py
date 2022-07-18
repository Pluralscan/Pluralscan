import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    InMemoryAnalyzerRepositorySeeder


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def seeder(repository):
    return InMemoryAnalyzerRepositorySeeder(repository)


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
