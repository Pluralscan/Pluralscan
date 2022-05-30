import pytest
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.executable.executable import Executable


@pytest.fixture
def analyzer() -> Analyzer:
    analyzer = Analyzer("Test", "Test 1")
    analyzer.add_executable(Executable(version="1.0"))
    return analyzer

def test_get_executable_by_version_returns_executable(analyzer):
    version = "1.0"
    result = analyzer.get_executable_by_version(version)
    assert result is not None

def test_get_executable_by_version_returns_none(analyzer):
    version = "2.0"
    result = analyzer.get_executable_by_version(version)
    assert result is None