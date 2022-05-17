# import unittest

# from cleansecpy.libs.utils.uri import UriUtils


# extension_validations = [
#     ('https://github.com/gromatluidgi/Cast.RestClient/archive/refs/heads/main.zip', '.zip'),
#     ('https://github.com/gromatluidgi/Cast.RestClient.git', '.git')
# ]

# filename_validations = [
#     ('https://github.com/gromatluidgi/Cast.RestClient/archive/refs/heads/main.zip', 'main.zip'),
#     ('https://github.com/gromatluidgi/Cast.RestClient.git', 'cast.restclient.git')
# ]


# class TestUtils(unittest.TestCase):
#     def test_get_uri_extension_acts_as_expected(self):
#         # Prepare
#         for url, extension in extension_validations:
#             with self.subTest():
#                 # Act
#                 def callable() -> str | None:
#                     try:
#                         return UriUtils.get_uri_extension(url)
#                     except Exception:
#                         return None
#                 result = callable()

#                 # Assert
#                 self.assertEqual(result, extension)

#     def test_get_uri_extension_acts_as_expected(self):
#         # Prepare
#         for url, filename in filename_validations:
#             with self.subTest():
#                 # Act
#                 def callable() -> str | None:
#                     try:
#                         return UriUtils.get_uri_filename(filename)
#                     except Exception:
#                         return None
#                 result = callable()

#                 # Assert
#                 self.assertEqual(result, filename)
