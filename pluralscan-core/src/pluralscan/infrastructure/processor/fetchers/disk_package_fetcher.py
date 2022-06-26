import os
import pathlib
import traceback
import zipfile

from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher, DownloadPackageResult, PackageInfoResult)
from pluralscan.libs.utils.uri import UriUtils


class DiskPackageFetcher(AbstractPackageFetcher):
    """DiskPackageFetcher"""

    supported_extensions = [".zip"]

    def __init__(self, output_dir: str):
        self._output_dir = output_dir

    def get_info(self, uri: str) -> PackageInfoResult:
        return PackageInfoResult()

    def can_fetch(self, uri: str) -> bool:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        return os.path.exists(uri)

    def download(self, uri) -> DownloadPackageResult:
        try:
            if not self.can_fetch(uri):
                return DownloadPackageResult(error="")
        except ValueError:
            return DownloadPackageResult(error="")

        try:
            return self._extract_archive(uri, self._output_dir)
        except EnvironmentError:
            print(traceback.print_exc())
            return DownloadPackageResult(error="")

    def _extract_archive(self, source: str, destination: str) -> DownloadPackageResult:
        with zipfile.ZipFile(source,"r") as zip_ref:
            zip_ref.extractall(destination)
        output_dir = pathlib.Path.joinpath(pathlib.Path(destination), UriUtils.get_uri_filename(source, True))
        return DownloadPackageResult(output_dir=str(output_dir))
