import dataclasses
import os
import traceback
import requests
from cleansecpy.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    PackageFetcherOptions,
    DownloadPackageResult,
    PackageInfoResult,
)
from cleansecpy.libs.utils.http import HttpUtils
from cleansecpy.libs.utils.uri import UriUtils


@dataclasses
class HttpPackageFetcherOptions:
    """HttpPackageFetcherOptions"""

    output_dir: str = None
    credentials = None


class HttpPackageFetcher(AbstractPackageFetcher):
    """HttpPackageFetcher"""

    supported_extensions = [".zip"]

    def __init__(self, options: HttpPackageFetcherOptions()):
        self._options = options

    def get_info(self, uri: str) -> PackageInfoResult:
        return PackageInfoResult()

    def can_fetch(self, uri: str) -> bool:
        return False

    def download(self, uri) -> DownloadPackageResult:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        if options is None:
            options = PackageFetcherOptions()

        try:
            return self._download_archive(uri)
        except:
            print(traceback.print_exc())
            return DownloadPackageResult(error="")

    def _download_archive(self, uri: str) -> DownloadPackageResult:
        response = requests.get(uri)

        if not HttpUtils.is_http_success(response.status_code):
            raise Exception

        archive_path = os.path.join(self._options.output_dir, "")
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return DownloadPackageResult(output_dir=archive_path)
