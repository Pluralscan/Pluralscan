import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    InMemoryAnalyzerRepositorySeeder
from pluralscan.domain.analyzers.analyzer import Analyzer
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def analyzer():
    return Analyzer(AnalyzerId("Test"), "TestAnalyzer", "1.0")

# def test_add_returns_analyzer(
#         seeder: InMemoryAnalyzerRepositorySeeder,
#         repository: InMemoryAnalyzerRepository,
#         analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     result = repository.add(analyzer_mock)

#     # Assert
#     assert result != None
#     assert result.analyzer_id != None


# def test_find_all_returns_analyzers(
#         seeder: InMemoryAnalyzerRepositorySeeder,
#         repository: InMemoryAnalyzerRepository):
#     # Act
#     seeder.reset_and_seed()
#     analyzers = repository.find_all()

#     # Assert
#     assert len(analyzers) > 0


# def test_get_by_id_returns_analyzer(
#         seeder: InMemoryAnalyzerRepositorySeeder,
#         repository: InMemoryAnalyzerRepository,
#         analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     analyzer = repository.get_by_id(analyzer.analyzer_id)

#     # Assert
#     assert analyzer != None


# def test_update_returns_analyzer(seeder: InMemoryAnalyzerRepositorySeeder,
#                                  repository: InMemoryAnalyzerRepository,
#                                  analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     analyzer.name = "Custom Name"
#     analyzer = repository.update(analyzer)

#     # Assert
#     assert analyzer.name == "Custom Name"


# def test_given_valid_input_remove_returns(seeder: InMemoryAnalyzerRepositorySeeder,
#                                           repository: InMemoryAnalyzerRepository,
#                                           analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     deleted_count = repository.remove(analyzer.analyzer_id)

#     # Assert
#     assert deleted_count == 1
#     assert repository.count() == 0
