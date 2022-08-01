import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    InMemoryAnalyzerRepositorySeeder
    

@pytest.fixture
def analyzer_repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def seeder(analyzer_repository):
    return InMemoryAnalyzerRepositorySeeder(analyzer_repository)


def test_add_entities(repository: InMemoryAnalyzerRepository, seeder: InMemoryAnalyzerRepositorySeeder):
    # Act
    seeder._add_entities()

    # Assert
    assert repository.count() == 3


def test_seed(repository: InMemoryAnalyzerRepository, seeder: InMemoryAnalyzerRepositorySeeder):
    # Act
    seeder.seed()

    # Assert
    assert repository.count() == 2, "two analyzers was expected"


def test_seed_raises_exception(seeder: InMemoryAnalyzerRepositorySeeder):
    # Act
    seeder._add_entities()

    # Assert
    with pytest.raises(Exception):
        seeder.seed()
