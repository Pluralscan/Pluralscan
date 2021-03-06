# import unittest
# from pluralscan.data.inmemory.analyser_repository import InMemoryAnalyzerRepository

# from pluralscan.domain.analyzer.analyzer import Analyzer
# from tests.test_helpers import TestHelpers

# class TestInMemoryAnalyzerRepository(unittest.TestCase):
#     def setUp(self):
#         self.repository = InMemoryAnalyzerRepository()

#     def test_add_returns_analyzer(self):
#         # Arrange
#         analyzer = Analyzer("Test", "1.0")

#         # Act
#         result = self.repository.add(analyzer)

#         # Assert
#         assert result is not None
#         assert TestHelpers.is_valid_uuid(result.analyzer_id) is True

#     def test_find_all_returns_analyzers(self):
#         # Arrange
#         analyzer = Analyzer("Test")
#         self.repository.add(analyzer)
#         self.repository.add(analyzer)

#         # Act
#         analyzers = self.repository.find_all()

#         # Assert
#         assert analyzers != None
#         assert len(analyzers) == 2

#     def test_get_by_id_returns_analyzer(self):
#         # Arrange
#         analyzer = Analyzer("Test")
#         self.repository.add(analyzer)
#         analyzer_id = analyzer.analyzer_id

#         # Act
#         analyzer = self.repository.get_by_id(analyzer_id)

#         # Assert
#         assert analyzer != None

#     def test_update_returns_analyzer(self):
#         # Arrange
#         analyzer = Analyzer("Test")
#         self.repository.add(analyzer)

#         # Act
#         analyzer.name = "Custom Name"
#         analyzer = self.repository.update(analyzer)

#         # Assert
#         assert analyzer != None
#         assert analyzer.name == "Custom Name"

#     def test_given_valid_input_remove_returns(self):
#         # Arrange
#         analyzer = Analyzer("Test")
#         self.repository.add(analyzer)
#         analyzer_id = analyzer.analyzer_id

#         # Act
#         def callable():
#             self.repository.remove(analyzer_id)
#             return True

#         # Assert
#         assert callable() == True

#     def test_given_invalid_input_remove_raises(self):
#         # Arrange
#         analyzer_id = ""

#         # Act
#         def callable():
#             self.repository.remove(analyzer_id)

#         # Assert
#         self.assertRaises(Exception, callable)