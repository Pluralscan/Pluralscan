from pymongo import MongoClient
import pytest
from cleansecpy.data.mongodb.analyzer.analyzer_repository import MongoAnalyzerRepository
from cleansecpy.data.mongodb.analyzer.analyzer_seeder import AnalyzerRepositorySeeder
from cleansecpy.data.mongodb.options import MongoRepositoryOptions

from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId


@pytest.fixture
def options():
    return MongoRepositoryOptions(
        MongoClient(),
        "cleansecpy_test",
        "analyzers"
    )


@pytest.fixture
def database(options):
    return options.client[options.database_name]


@pytest.fixture
def repository(options):
    return MongoAnalyzerRepository(options)


@pytest.fixture
def seeder(options):
    return AnalyzerRepositorySeeder(options)


@pytest.fixture
def analyzer():
    return Analyzer(AnalyzerId("Test"), "TestAnalyzer", "1.0")


def test_add_returns_analyzer(
        seeder: AnalyzerRepositorySeeder,
        repository: MongoAnalyzerRepository,
        analyzer: Analyzer):
    # Act
    seeder._drop_collection()
    result = repository.add(analyzer)

    # Assert
    assert result != None
    assert result.analyzer_id != None


def test_get_all_returns_analyzers(
        seeder: AnalyzerRepositorySeeder,
        repository: MongoAnalyzerRepository):
    # Act
    seeder.reset_and_seed()
    analyzers = repository.get_all()

    # Assert
    assert len(analyzers) > 0


def test_find_by_id_returns_analyzer(
        seeder: AnalyzerRepositorySeeder,
        repository: MongoAnalyzerRepository,
        analyzer: Analyzer):
    # Act
    seeder._drop_collection()
    analyzer = repository.add(analyzer)
    analyzer = repository.find_by_id(analyzer.analyzer_id)

    # Assert
    assert analyzer != None


def test_update_returns_analyzer(seeder: AnalyzerRepositorySeeder,
                                 repository: MongoAnalyzerRepository,
                                 analyzer: Analyzer):
    # Act
    seeder._drop_collection()
    analyzer = repository.add(analyzer)
    analyzer.name = "Custom Name"
    analyzer = repository.update(analyzer)

    # Assert
    assert analyzer.name == "Custom Name"


def test_given_valid_input_remove_returns(seeder: AnalyzerRepositorySeeder,
                                          repository: MongoAnalyzerRepository,
                                          analyzer: Analyzer):
    # Act
    seeder._drop_collection()
    analyzer = repository.add(analyzer)
    deleted_count = repository.remove(analyzer.analyzer_id)

    # Assert
    assert deleted_count == 1
    assert repository.count() == 0


def test_given_invalid_input_remove_raises(seeder: AnalyzerRepositorySeeder,
                                           repository: MongoAnalyzerRepository):
    # Act
    seeder._drop_collection()

    # Assert
    with pytest.raises(Exception):
        repository.remove("test")
