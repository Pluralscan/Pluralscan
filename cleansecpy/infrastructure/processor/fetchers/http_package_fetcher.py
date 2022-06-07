import os
import traceback
import requests
from cleansecpy.application.processor.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    PackageFetcherOptions,
    PackageFetcherResult,
)
from cleansecpy.libs.utils.http import HttpUtils
from cleansecpy.libs.utils.uri import UriUtils


class HttpPackageFetcher(AbstractPackageFetcher):
    """HttpPackageFetcher"""

    supported_extensions = [".zip"]

    def __init__(self, options: PackageFetcherOptions()):
        super().__init__(options)

    @classmethod
    def download(cls, uri) -> PackageFetcherResult:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in cls.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        if options is None:
            options = PackageFetcherOptions()

        try:
            return cls._download_archive(uri, options)
        except:
            print(traceback.print_exc())
            return PackageFetcherResult(error="")

    def _download_archive(self, uri: str) -> PackageFetcherResult:
        response = requests.get(uri)

        if not HttpUtils.is_http_success(response.status_code):
            raise Exception

        archive_path = os.path.join(self._options.output_dir, "")
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return PackageFetcherResult(path=archive_path)
