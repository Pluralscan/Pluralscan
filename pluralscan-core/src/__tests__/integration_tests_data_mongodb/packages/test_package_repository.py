import pytest
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pluralscan.data.mongodb.packages.package_repository import \
    MongoPackageRepository
from pluralscan.data.mongodb.packages.package_seeder import \
    PackageRepositorySeeder
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId
from pymongo import MongoClient


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


@pytest.fixture
def package():
    return Package(PackageId("Test"), "TestAnalyzer", "1.0")


def test_add_returns_analyzer(
        seeder: PackageRepositorySeeder,
        repository: MongoPackageRepository,
        package: Package):
    # Act
    seeder._drop_collection()
    result = repository.add(package)

    # Assert
    assert result != None
    assert result.package_id != None


def test_get_all_returns_analyzers(
        seeder: PackageRepositorySeeder,
        repository: MongoPackageRepository):
    # Act
    seeder.reset_and_seed()
    packages = repository.get_all()

    # Assert
    assert len(packages) > 0


def test_find_by_id_returns_analyzer(
        seeder: PackageRepositorySeeder,
        repository: MongoPackageRepository,
        package: Package):
    # Act
    seeder._drop_collection()
    package = repository.add(package)
    package = repository.find_by_id(package.package_id)

    # Assert
    assert package != None


def test_update_returns_analyzer(seeder: PackageRepositorySeeder,
                                 repository: MongoPackageRepository,
                                 package: Package):
    # Act
    seeder._drop_collection()
    package = repository.add(package)
    package.name = "Custom Name"
    package = repository.update(package)

    # Assert
    assert package.name == "Custom Name"


def test_given_valid_input_remove_returns(seeder: PackageRepositorySeeder,
                                          repository: MongoPackageRepository,
                                          package: Package):
    # Act
    seeder._drop_collection()
    package = repository.add(package)
    deleted_count = repository.remove(package.package_id)

    # Assert
    assert deleted_count == 1
    assert repository.count() == 0


def test_given_invalid_input_remove_raises(seeder: PackageRepositorySeeder,
                                           repository: MongoPackageRepository):
    # Act
    seeder._drop_collection()

    # Assert
    with pytest.raises(Exception):
        repository.remove("test")
