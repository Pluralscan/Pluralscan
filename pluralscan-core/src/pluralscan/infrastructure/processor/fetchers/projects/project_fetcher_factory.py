from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher,
    AbstractProjectFetcherFactory,
)
from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.infrastructure.processor.fetchers.projects.disk_project_fetcher import (
    DiskProjectFetcher,
)
from pluralscan.infrastructure.processor.fetchers.projects.github_project_fetcher import (
    GithubProjectFetcher,
)
from pluralscan.infrastructure.processor.fetchers.projects.gitlab_project_fetcher import (
    GitlabProjectFetcher,
)


class ProjectFetcherFactory(AbstractProjectFetcherFactory):
    """PackageFetcherFactory"""

    def create(self, uri: str) -> AbstractProjectFetcher:
        """create"""
        source = ProjectSource.from_uri(uri)

        if source is ProjectSource.GITLAB:
            return GitlabProjectFetcher()

        if source is ProjectSource.GITHUB:
            return GithubProjectFetcher()

        if source is ProjectSource.LOCAL:
            return DiskProjectFetcher()

        raise NotImplementedError
