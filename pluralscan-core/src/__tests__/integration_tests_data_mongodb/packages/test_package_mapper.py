import pytest
from pluralscan.data.mongodb.packages.package_document import PackageDocument
from pluralscan.data.mongodb.packages.package_mapper import PackageMapper
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId


@pytest.fixture
def package():
    return Package(PackageId("Test"), "Test", "1.0")


@pytest.fixture
def document():
    return PackageMapper(None, "Test", "1.0")


@pytest.fixture
def documents():
    return [PackageDocument(None, "Test", "1.0"), PackageDocument(None, "Test2", "1.0")]


def test_to_document(package: Package):
    # Act
    document = PackageMapper.to_document(package)

    # Assert
    assert document.name == package.name


def test_from_document(document: PackageDocument):
    # Act
    package = PackageMapper.from_document(document)

    # Assert
    assert package.name == document.name
    assert package.name == document.get("name")
    assert package.version == document.version
    assert package.version == document.get("version")
    assert package.package_id == document._id or None
    assert package.package_id == document.get("_id", None) or None


def test_from_documents(documents):
    # Act
    analyzers = PackageMapper.from_documents(documents)

    # Assert
    assert len(analyzers) == 2
