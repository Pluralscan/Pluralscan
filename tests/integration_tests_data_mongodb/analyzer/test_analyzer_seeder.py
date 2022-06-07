from collections import OrderedDict
from pymongo import MongoClient
import pytest

from cleansecpy.data.mongodb.analyzer.analyzer_repository import MongoAnalyzerRepository
from cleansecpy.data.mongodb.analyzer.analyzer_seeder import AnalyzerRepositorySeeder
from cleansecpy.data.mongodb.options import MongoRepositoryOptions


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


def test_create_collection_with_validation(options, database, seeder: AnalyzerRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._create_collection_with_validation()
    collection = database[options.collection_name]
    rules = OrderedDict(collection.options().get('validator'))

    # Assert
    assert collection != None
    assert len(rules) == 1
    assert len(rules.get("$jsonSchema")['required']) == 2


def test_add_documents(repository: MongoAnalyzerRepository, seeder: AnalyzerRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._add_documents()

    # Assert
    assert repository.count() == 3


def test_drop_collection(seeder: AnalyzerRepositorySeeder):
    # Act
    seeder._drop_collection()

    # Assert
    assert seeder._collection_exists() == False


def test_seed(repository: MongoAnalyzerRepository, seeder: AnalyzerRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder.seed()

    # Assert
    assert repository.count() == 2, "two analyzers was expected"


def test_seed_raises_exception(seeder: AnalyzerRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._add_documents()

    # Assert
    with pytest.raises(Exception):
        seeder.seed()


def test_reset_and_seed(repository: MongoAnalyzerRepository, seeder: AnalyzerRepositorySeeder):
    # Act
    seeder.reset_and_seed()

    # Assert
    assert repository.count() == 2
