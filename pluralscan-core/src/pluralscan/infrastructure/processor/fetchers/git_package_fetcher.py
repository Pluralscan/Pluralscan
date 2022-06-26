import traceback
from dataclasses import dataclass

import requests
from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher, DownloadPackageResult, PackageInfoResult)
from pluralscan.libs.utils.uri import UriUtils


@dataclass
class GitPackageFetcherOptions:
    """GitPackageFetcherOptions"""

    output_dir: str = None
    credentials = None
    
class GitPackageFetcher(AbstractPackageFetcher):
    """GitPackageFetcher"""

    supported_extensions = [".git"]

    def __init__(self, options: GitPackageFetcherOptions = GitPackageFetcherOptions()):
        pass

    def get_info(self, uri: str) -> PackageInfoResult:
        return super().get_info(uri)

    def can_fetch(self, uri: str) -> bool:
        return False

    def download(
        self, uri, options: GitPackageFetcherOptions = ...
    ) -> DownloadPackageResult:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        try:
            return self._clone(uri, options)
        except Exception:
            print(traceback.print_exc())
            return DownloadPackageResult(error="")

    def _clone(self, uri: str, options: GitPackageFetcherOptions) -> DownloadPackageResult:
        response = requests.get(uri)
        archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return DownloadPackageResult()
