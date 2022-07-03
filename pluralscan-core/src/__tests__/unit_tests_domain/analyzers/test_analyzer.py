# import pytest
# from pluralscan.domain.analyzer.analyzer import Analyzer
# from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
# from pluralscan.domain.executables.executable import Executable


# @pytest.fixture
# def analyzer() -> Analyzer:
#     analyzer = Analyzer(AnalyzerId("Test"), "Test 1")
#     analyzer.add_executable(Executable(version="1.0"))
#     return analyzer

# def test_get_executable_by_version_returns_executable(analyzer: Analyzer):
#     version = "1.0"
#     result = analyzer.get_executable_by_version(version)
#     assert result is not None

# def test_get_executable_by_version_returns_none(analyzer: Analyzer):
#     version = "2.0"
#     result = analyzer.get_executable_by_version(version)
#     assert result is None
