import traceback
import requests
from cleansecpy.application.processor.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    PackageFetcherOptions,
    PackageFetcherResult,
)
from cleansecpy.libs.utils.uri import UriUtils


class GithubPackageFetcher(AbstractPackageFetcher):
    """GithubPackageFetcher"""

    supported_extensions = [".git"]

    def download(
        self, uri, options: PackageFetcherOptions = ...
    ) -> PackageFetcherResult:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        try:
            return self._clone(uri, options)
        except:
            print(traceback.print_exc())
            return PackageFetcherResult(error="")

    def _clone(self, uri: str, options: PackageFetcherOptions) -> PackageFetcherResult:
        response = requests.get(uri)
        archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return PackageFetcherResult(path=archive_path)
