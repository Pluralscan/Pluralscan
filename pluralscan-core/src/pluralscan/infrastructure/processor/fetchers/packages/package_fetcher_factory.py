# import re

# from pluralscan.application.processors.fetchers.package_fetcher import (
#     AbstractPackageFetcher, AbstractPackageFetcherFactory)
# from pluralscan.infrastructure.processor.fetchers.disk_package_fetcher import \
#     DiskPackageFetcher

# GITHUB_ORIGIN_PATTERN = r"[^/]+.git$"
# GITLAB_ORIGIN_PATTERN = r"(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?"
# GIT_ORIGIN_PATTERN = r"[^/]+.git$"
# LOCAL_ORIGIN_PATTERN = r"[^/]+.git$"


# class PackageFetcherFactory(AbstractPackageFetcherFactory):
#     """PackageFetcherFactory"""

#     def create(self, uri: str) -> AbstractPackageFetcher:
#         """create"""
#         origin = self._detect_origin(uri)
#         if origin == PackageOrigin.UNKNOWN:
#             raise ValueError

#         if origin == PackageOrigin.GITLAB:
#             options = GitlabPackageFetcherOptions()
#             return GitlabPackageFetcher(options)

#         if origin == PackageOrigin.LOCAL:
#             return DiskPackageFetcher()

#         raise NotImplementedError

#     def _detect_origin(self, uri: str) -> PackageOrigin:
#         if re.search(GIT_ORIGIN_PATTERN, uri):
#             return PackageOrigin.GIT

#         if re.search(GITHUB_ORIGIN_PATTERN, uri):
#             return PackageOrigin.GITHUB

#         if re.search(GITLAB_ORIGIN_PATTERN, uri):
#             return PackageOrigin.GITLAB

#         if re.search(LOCAL_ORIGIN_PATTERN, uri):
#             return PackageOrigin.LOCAL

#         return PackageOrigin.UNKNOWN
