import datetime
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List

import gitlab
from gitlab.v4.objects.projects import Project
from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher,
    DownloadProjectResult,
    ProjectInfoResult,
)
from pluralscan.domain.shared.language import Language
from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.domain.shared.technology import Technology


@dataclass
class GitlabProjectFetcherOptions:
    """GitlabPackageFetcherOptions"""

    credentials = None


class GitlabProjectFetcher(AbstractProjectFetcher):
    """
    This class provide business logic for retrieve package informations
    for a Github repository.
    """

    def __init__(
        self, options: GitlabProjectFetcherOptions = GitlabProjectFetcherOptions()
    ):
        self._options = options
        self._gitlab_client = gitlab.Gitlab()

    def get_info(self, uri: str) -> ProjectInfoResult:
        project = self._get_project(uri)
        project_languages = project.languages()

        project_name: str = project.attributes.get("path_with_namespace", None)
        if project_name is None:
            raise RuntimeError

        namespace: dict = project.attributes.get("namespace", None)
        if namespace is None:
            raise RuntimeError

        technologies: List[Technology] = []
        if isinstance(project_languages, Dict):
            for lang in project_languages.keys():
                if Language.from_code(lang).code == Language.unknown().code:
                    continue

                technologies.append(
                    Technology.from_code(Language.from_code(lang).code)
                )

        return ProjectInfoResult(
            source=ProjectSource.GITLAB,
            author=namespace.get('name', ""),
            homepage=uri,
            namespace=project_name,
            display_name=project.attributes.get("name", ""),
            description=project.attributes.get("description", ""),
            last_update=datetime.datetime.strptime(project.attributes.get("last_activity_at", datetime.datetime.now()), '%Y-%m-%dT%H:%M:%S.%f%z'),
            technologies=technologies
        )

    def download(self, uri: str, output_dir: str) -> DownloadProjectResult:
        if not uri:
            raise ValueError("A valid uri must be provide.")

        project = self._get_project(uri=uri)

        if not Path.exists(Path(output_dir)):
            Path.mkdir(Path(output_dir), parents=True)

        archive_path = Path.joinpath(
            Path(output_dir), "package.zip"
        )

        with open(archive_path, "wb") as stream:
            project.repository_archive(format="zip", streamed=True, action=stream.write)

        return DownloadProjectResult(output_dir=output_dir)

    @classmethod
    def parse_gitlab_url(cls, uri: str) -> str:
        """parse_gitlab_url"""
        pattern = re.compile(
            r"(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?"
        )
        match = pattern.search(uri)
        if match is not None:
            owner = match.group(6)
            repo = match.group(8)
            return "/".join([owner, repo])
        raise RuntimeError()

    def _get_project(self, uri: str) -> Project:
        uri = self.parse_gitlab_url(uri)
        project = self._gitlab_client.projects.get(uri)
        return project
