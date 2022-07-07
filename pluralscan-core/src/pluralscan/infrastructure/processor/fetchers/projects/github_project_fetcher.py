import re

from dataclasses import dataclass

from git import Repo
from github import Github, Repository
from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher,
    DownloadProjectResult,
    ProjectInfoResult,
)
from pluralscan.domain.common.language import Language
from pluralscan.domain.common.metrics import ProjectLanguageMetric
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class GithubProjectFetcherOptions:
    """GithubPackageFetcherOptions"""

    credentials = None


class GithubProjectFetcher(AbstractProjectFetcher):
    """
    This class provide business logic for retrieve package informations
    for a Github repository.
    """

    def __init__(
        self, options: GithubProjectFetcherOptions = GithubProjectFetcherOptions()
    ):
        self._options = options
        self._github_client = Github()

    def get_info(self, uri: str) -> ProjectInfoResult:
        uri = self._parse_github_url(uri)
        # https://docs.github.com/en/rest/repos/repos#get-a-repository
        repo = self._github_client.get_repo(uri)
        repo_languages = repo.get_languages()

        language_metrics = []
        for lang in repo_languages.keys():
            if Language.from_code(lang).code == Language.unknown().code:
                continue

            language_metrics.append(
                ProjectLanguageMetric(Language.from_code(lang), repo_languages[lang])
            )

        return ProjectInfoResult(
            name=repo.full_name,
            display_name=repo.name,
            description=repo.description,
            uri=uri,
            source=ProjectSource.GITHUB,
            last_update=repo.updated_at,
            language_metrics=language_metrics,
        )

    def download(self, uri, output_dir: str) -> DownloadProjectResult:
        return self._clone(uri, output_dir)

    def _get_repo(self, uri: str) -> Repository.Repository:
        uri = self._parse_github_url(uri)
        return self._github_client.get_repo(uri)

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

    # TODO: fetching an archive is preferable => package should be unzip only for scan purpose => remove unzip after scan
    def _clone(self, git_url: str, output_dir: str) -> DownloadProjectResult:
        if not git_url:
            raise ValueError("A valid uri must be provide.")

        repository = self._get_repo(uri=git_url)
        Repo.clone_from(repository.clone_url, output_dir)
        return DownloadProjectResult(output_dir=output_dir)
