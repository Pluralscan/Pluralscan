import os
import pathlib
import shutil
import zipfile

from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher, DownloadProjectResult, ProjectInfoResult)
from pluralscan.libs.utils.uri import UriUtils


class DiskProjectFetcher(AbstractProjectFetcher):
    """DiskPackageFetcher"""

    supported_extensions = [".zip", ".tar"]

    def get_info(self, uri: str) -> ProjectInfoResult:
        raise NotImplementedError

    def _can_fetch(self, uri: str) -> bool:
        extension = UriUtils.get_uri_extension(uri)

        if extension not in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        return os.path.exists(uri)

    def download(self, uri: str, output_dir: str) -> DownloadProjectResult:
        if not self._can_fetch(uri):
            raise RuntimeError
        return self._copy_archive(uri, output_dir)

    def _copy_archive(self, source: str, destination: str) -> DownloadProjectResult:
        shutil.copy(source, destination)
        return DownloadProjectResult(output_dir=destination, archive_path="")

    # def _extract_archive(self, source: str, destination: str) -> DownloadProjectResult:
    #     with zipfile.ZipFile(source,"r") as zip_ref:
    #         zip_ref.extractall(destination)
    #     output_dir = pathlib.Path.joinpath(pathlib.Path(destination), UriUtils.get_uri_filename(source, True))
    #     return DownloadProjectResult(output_dir=str(output_dir))
