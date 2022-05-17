# import unittest

# from cleansecpy.domain.analyzer.analyzer import Analyzer


# input_validations = [('Test', True), ('a', False)]

# class Testanalyzer(unittest.TestCase):
#     def test_init_acts_as_expected(self):
#         # Prepare
#         for name, expected in input_validations:
#             with self.subTest():
#                 # Act
#                 def callable() -> Analyzer | None:
#                     try:
#                         return Analyzer(name=name)
#                     except Exception:
#                         return None
#                 result = callable()

#                 # Assert
#                 self.assertEqual(isinstance(result, Analyzer) , expected)
                
