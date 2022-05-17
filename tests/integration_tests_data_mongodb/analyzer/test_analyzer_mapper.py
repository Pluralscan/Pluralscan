import pytest
from cleansecpy.data.mongodb.analyzer.analyzer_document import AnalyzerDocument
from cleansecpy.data.mongodb.analyzer.analyzer_mapper import AnalyzerMapper
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId


@pytest.fixture
def analyzer():
    return Analyzer(AnalyzerId("Test"), "Test", "1.0")


@pytest.fixture
def document():
    return AnalyzerDocument(None, "Test", "1.0")


@pytest.fixture
def documents():
    return [
        AnalyzerDocument(None, "Test", "1.0"),
        AnalyzerDocument(None, "Test2", "1.0")
    ]


def test_to_document(analyzer: Analyzer):
    # Act
    document = AnalyzerMapper.to_document(analyzer)

    # Assert
    assert document.name == analyzer.name


def test_from_document(document: AnalyzerDocument):
    # Act
    analyzer = AnalyzerMapper.from_document(document)

    # Assert
    assert analyzer.name == document.name
    assert analyzer.name == document.get('name')
    assert analyzer.version == document.version
    assert analyzer.version == document.get('version')
    assert analyzer.analyzer_id == document._id or None
    assert analyzer.analyzer_id == document.get('_id', None) or None


def test_from_documents(documents):
    # Act
    analyzers = AnalyzerMapper.from_documents(documents)

    # Assert
    assert len(analyzers) == 2
