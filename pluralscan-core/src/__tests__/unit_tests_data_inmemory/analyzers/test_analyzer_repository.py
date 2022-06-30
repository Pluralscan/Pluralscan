import pytest
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    AnalyzerInMemoryRepositorySeeder
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId


@pytest.fixture
def repository():
    return InMemoryAnalyzerRepository()


@pytest.fixture
def analyzer():
    return Analyzer(AnalyzerId("Test"), "TestAnalyzer", "1.0")

# def test_add_returns_analyzer(
#         seeder: AnalyzerInMemoryRepositorySeeder,
#         repository: InMemoryAnalyzerRepository,
#         analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     result = repository.add(analyzer_mock)

#     # Assert
#     assert result != None
#     assert result.analyzer_id != None


# def test_get_all_returns_analyzers(
#         seeder: AnalyzerInMemoryRepositorySeeder,
#         repository: InMemoryAnalyzerRepository):
#     # Act
#     seeder.reset_and_seed()
#     analyzers = repository.get_all()

#     # Assert
#     assert len(analyzers) > 0


# def test_get_by_id_returns_analyzer(
#         seeder: AnalyzerInMemoryRepositorySeeder,
#         repository: InMemoryAnalyzerRepository,
#         analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     analyzer = repository.get_by_id(analyzer.analyzer_id)

#     # Assert
#     assert analyzer != None


# def test_update_returns_analyzer(seeder: AnalyzerInMemoryRepositorySeeder,
#                                  repository: InMemoryAnalyzerRepository,
#                                  analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     analyzer.name = "Custom Name"
#     analyzer = repository.update(analyzer)

#     # Assert
#     assert analyzer.name == "Custom Name"


# def test_given_valid_input_remove_returns(seeder: AnalyzerInMemoryRepositorySeeder,
#                                           repository: InMemoryAnalyzerRepository,
#                                           analyzer_mock: Analyzer):
#     # Act
#     seeder._reset_database()
#     analyzer = repository.add(analyzer_mock)
#     deleted_count = repository.remove(analyzer.analyzer_id)

#     # Assert
#     assert deleted_count == 1
#     assert repository.count() == 0
