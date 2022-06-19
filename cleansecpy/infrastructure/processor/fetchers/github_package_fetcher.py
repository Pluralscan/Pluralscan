from dataclasses import dataclass
import re
import traceback
import github
import requests
from github import Github
from cleansecpy.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
    DownloadPackageResult,
    PackageInfoResult,
)
from cleansecpy.libs.utils.uri import UriUtils


@dataclass
class GithubPackageFetcherOptions:
    """GithubPackageFetcherOptions"""

    output_dir: str = None
    credentials = None


class GithubPackageFetcher(AbstractPackageFetcher):
    """
    This class provide business logic for retrieve package informations
    for a Github repository.
    """

    def __init__(
        self, options: GithubPackageFetcherOptions = GithubPackageFetcherOptions()
    ):
        self._options = options
        self._github_client = Github()

    def get_info(self, uri: str) -> PackageInfoResult:
        uri = self._parse_github_url(uri)
        repo = self._github_client.get_repo(uri)
        try:
            latest_release = repo.get_latest_release()
            version = latest_release.tag_name
        except github.GithubException:
            version = "dev"

        return PackageInfoResult(
            name=repo.name,
            full_name=repo.full_name,
            description=repo.description,
            version=version,
        )

    def can_fetch(self, uri: str) -> bool:
        try:
            uri = self._parse_github_url(uri)
            self._github_client.get_repo(uri)
            return True
        except ValueError:
            return False
        except github.GithubException:
            return False
        except RuntimeError:
            return False

    def download(
        self, uri, options: GithubPackageFetcherOptions = ...
    ) -> DownloadPackageResult:
        try:
            return self._clone(uri, options)
        except EnvironmentError:
            print(traceback.print_exc())
            return DownloadPackageResult(error="")

    def _parse_github_url(self, uri: str) -> str:
        if not uri:
            raise ValueError("A valid uri must be provide.")

        pattern = re.compile(
            r"(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?"
        )
        match = pattern.search(uri)
        if match is not None:
            owner = match.group(6)
            repo = match.group(8)
            return "/".join([owner, repo])
        raise RuntimeError()

    def _clone(
        self, uri: str, options: GithubPackageFetcherOptions
    ) -> DownloadPackageResult:
        if not uri:
            raise ValueError("A valid uri must be provide.")

        response = requests.get(uri)
        archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, "wb") as stream:
            stream.write(response.content)
        return DownloadPackageResult()
