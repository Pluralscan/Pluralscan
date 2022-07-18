# import traceback
# from dataclasses import dataclass
# from typing import Optional

# import requests
# from pluralscan.application.processors.fetchers.package_fetcher import (
#     DownloadPackageResult,
# )
# from pluralscan.application.processors.fetchers.project_fetcher import (
#     AbstractProjectFetcher,
#     ProjectInfoResult,
# )
# from pluralscan.libs.utils.uri import UriUtils


# @dataclass
# class GitProjectFetcherOptions:
#     """GitPackageFetcherOptions"""

#     output_dir: Optional[str] = None
#     credentials = None


# class GitProjectFetcher(AbstractProjectFetcher):
#     """GitPackageFetcher"""

#     supported_extensions = [".git"]

#     def __init__(self, options: GitProjectFetcherOptions = GitProjectFetcherOptions()):
#         pass

#     def get_info(self, uri: str) -> ProjectInfoResult:
#         return super().get_info(uri)

#     def can_fetch(self, uri: str) -> bool:
#         return False

#     def download(self, uri) -> DownloadPackageResult:
#         extension = UriUtils.get_uri_extension(uri)

#         if extension not in self.supported_extensions:
#             raise ValueError("Unsupported uri extension.")

#         try:
#             return self._clone(uri, options)
#         except Exception:
#             return DownloadPackageResult(error="")

#     def _clone(
#         self, uri: str, options: GitProjectFetcherOptions
#     ) -> DownloadPackageResult:
#         response = requests.get(uri)
#         archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
#         with open(archive_path, "wb") as stream:
#             stream.write(response.content)
#         return DownloadPackageResult()
