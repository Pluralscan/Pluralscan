import pytest
from pluralscan.data.mongodb.analyzers.analyzer_validation import \
    AnalyzerRepositoryValidation
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pymongo import MongoClient


# Arrange
@pytest.fixture
def options():
    return MongoRepositoryOptions(
        MongoClient(),
        "pluralscan_test",
        "analyzers"
    )

@pytest.fixture
def validator(options):
    return AnalyzerRepositoryValidation(options)


def test_read_validation_command(validator: AnalyzerRepositoryValidation):
    # Act
    result = validator.read_validation_command()

    # Assert
    assert result != None
    assert len(result) == 2


def test_execute_on_existing_collection(validator: AnalyzerRepositoryValidation):
    # Act
    result = validator.execute_on_existing_collection()

    # Assert
    assert result != None
