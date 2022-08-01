from pathlib import Path
import re

from dataclasses import dataclass
import tempfile
from typing import List

from git import Repo
from github import Github, Repository
from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher,
    DownloadProjectResult,
    ProjectInfoResult,
)
from pluralscan.domain.shared.language import Language
from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.domain.shared.technology import Technology


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

        technologies: List[Technology] = []
        for lang in repo_languages.keys():
            if Language.from_code(lang).code == Language.unknown().code:
                continue

            technologies.append(
                Technology.from_code(lang)
            )

        return ProjectInfoResult(
            namespace=repo.full_name,
            display_name=repo.name,
            description=repo.description,
            homepage=uri,
            source=ProjectSource.GITHUB,
            last_update=repo.updated_at,
            technologies=technologies,
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

        temp_dir = tempfile.mkdtemp()
        repo = Repo.clone_from(repository.clone_url, Path(temp_dir))

        if not Path.exists(Path(output_dir)):
            Path.mkdir(Path(output_dir), parents=True)

        archive_path = Path.joinpath(Path(output_dir), "package.zip")

        with open(archive_path, "wb") as stream:
            repo.archive(stream, format="zip")

        return DownloadProjectResult(output_dir=output_dir)
