import os
import re
from dataclasses import dataclass

import gitlab
from gitlab.v4.objects.projects import Project
from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher, DownloadProjectResult, ProjectInfoResult)
from pluralscan.domain.projects.project_source import ProjectSource


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
        project_name = project.attributes.get("path_with_namespace")
        if project_name is None:
            raise RuntimeError

        return ProjectInfoResult(
            source=ProjectSource.GITLAB,
            uri=uri,
            name=project_name,
            display_name=project.attributes.get("name"),
            description=project.attributes.get("description"),
        )

    def download(self, uri: str, output_dir: str) -> DownloadProjectResult:
        if not uri:
            raise ValueError("A valid uri must be provide.")

        project = self._get_project(uri=uri)

        archive_path = os.path.join(output_dir, "")
        with open(archive_path, "wb") as stream:
            project.repository_archive(streamed=True, action=stream.write)

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
