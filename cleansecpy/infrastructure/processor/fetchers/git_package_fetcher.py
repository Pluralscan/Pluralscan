import traceback
import requests
from cleansecpy.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    DownloadPackageResult,
    PackageFetcherOptions,
    PackageInfoResult,
)
from cleansecpy.libs.utils.uri import UriUtils


class GitPackageFetcher(AbstractPackageFetcher):
    """GitPackageFetcher"""

    supported_extensions = [".git"]

    def __init__(self, options: PackageFetcherOptions = PackageFetcherOptions()):
        super().__init__(options)

    def get_info(self, uri: str) -> PackageInfoResult:
        return super().get_info(uri)

    def can_fetch(self, uri: str) -> bool:
        return False

    def download(
        self, uri, options: PackageFetcherOptions = ...
    ) -> DownloadPackageResult:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        try:
            return self._clone(uri, options)
        except:
            print(traceback.print_exc())
            return DownloadPackageResult(error="")

    def _clone(self, uri: str, options: PackageFetcherOptions) -> DownloadPackageResult:
        response = requests.get(uri)
        archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return DownloadPackageResult()
