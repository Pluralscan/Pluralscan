import re
from dataclasses import dataclass

import gitlab
import requests
from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher, DownloadPackageResult, PackageInfoResult)
from pluralscan.libs.utils.uri import UriUtils


@dataclass
class GitlabPackageFetcherOptions:
    """GitlabPackageFetcherOptions"""

    credentials = None


class GitlabPackageFetcher(AbstractPackageFetcher):
    """
    This class provide business logic for retrieve package informations
    for a Github repository.
    """

    def __init__(
        self, options: GitlabPackageFetcherOptions = GitlabPackageFetcherOptions()
    ):
        self._options = options
        self._gitlab_client = gitlab.Gitlab()

    def get_info(self, uri: str) -> PackageInfoResult:
        uri = self._parse_gitlab_url(uri)
        repo = self._gitlab_client.projects.get(uri)

        return PackageInfoResult(
            name="",
            full_name="",
            description="",
        )

    def can_fetch(self, uri: str) -> bool:
        uri = self._parse_gitlab_url(uri)
        try:
            self._gitlab_client.projects.get(uri)
            return True
        except gitlab.GitlabError:
            return False

    def download(self, uri, output_dir: str) -> DownloadPackageResult:
        try:
            return self._clone(uri, output_dir)
        except EnvironmentError:
            return DownloadPackageResult(error="")

    def _parse_gitlab_url(self, uri: str) -> str:
        pattern = re.compile(
            r"(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?"
        )
        match = pattern.search(uri)
        if match is not None:
            owner = match.group(6)
            repo = match.group(8)
            return "/".join([owner, repo])
        raise RuntimeError()

    def _clone(self, uri: str, output_dir: str) -> DownloadPackageResult:
        response = requests.get(uri)
        archive_path = output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return DownloadPackageResult()
