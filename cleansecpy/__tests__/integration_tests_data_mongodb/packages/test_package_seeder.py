from collections import OrderedDict
from pymongo import MongoClient
import pytest

from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.data.mongodb.packages.package_repository import MongoPackageRepository
from cleansecpy.data.mongodb.packages.package_seeder import PackageRepositorySeeder


@pytest.fixture
def options():
    return MongoRepositoryOptions(
        MongoClient(),
        "cleansecpy_test",
        "packages"
    )


@pytest.fixture
def database(options):
    return options.client[options.database_name]


@pytest.fixture
def repository(options):
    return MongoPackageRepository(options)


@pytest.fixture
def seeder(options):
    return PackageRepositorySeeder(options)


def test_create_collection_with_validation(options, database, seeder: PackageRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._create_collection_with_validation()
    collection = database[options.collection_name]
    rules = OrderedDict(collection.options().get('validator'))

    # Assert
    assert collection != None
    assert len(rules) == 1
    assert len(rules.get("$jsonSchema")['required']) == 2


def test_add_documents(repository: MongoPackageRepository, seeder: PackageRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._add_documents()

    # Assert
    assert repository.count() == 3


def test_drop_collection(seeder: PackageRepositorySeeder):
    # Act
    seeder._drop_collection()

    # Assert
    assert seeder._collection_exists() == False


def test_seed(repository: MongoPackageRepository, seeder: PackageRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder.seed()

    # Assert
    assert repository.count() == 2, "two packages was expected"


def test_seed_raises_exception(seeder: PackageRepositorySeeder):
    # Act
    seeder._drop_collection()
    seeder._add_documents()

    # Assert
    with pytest.raises(Exception):
        seeder.seed()


def test_reset_and_seed(repository: MongoPackageRepository, seeder: PackageRepositorySeeder):
    # Act
    seeder.reset_and_seed()

    # Assert
    assert repository.count() == 2
