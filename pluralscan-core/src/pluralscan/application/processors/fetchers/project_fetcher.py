from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.domain.technologies.technology import Technology


@dataclass(frozen=True)
class DownloadProjectResult:
    """DownloadProjectResult"""

    output_dir: str
    error: Optional[str] = None
    success: bool = error is None


@dataclass(frozen=True)
class ProjectInfoResult:
    """Data returned when querying a package details."""

    source: ProjectSource
    uri: str
    name: str
    last_update: datetime
    display_name: Optional[str] = None
    description: Optional[str] = None
    technologies: List[Technology] = field(default_factory=list)


class AbstractProjectFetcher(metaclass=ABCMeta):
    """Abstract interactor contract for fetching a source code package from an external source."""

    # @abstractmethod
    # def can_fetch(self, uri: str) -> bool:
    #     """Check if the package is accessible at the specified uri."""
    #     raise NotImplementedError

    @abstractmethod
    def get_info(self, uri: str) -> ProjectInfoResult:
        """Retrieve package information at the specified uri."""
        raise NotImplementedError

    @abstractmethod
    def download(self, uri: str, output_dir: str) -> DownloadProjectResult:
        """Download and save package to fetcher output directory."""
        raise NotImplementedError


class AbstractProjectFetcherFactory(metaclass=ABCMeta):
    """AbstractPackageFetcherFactory"""

    @abstractmethod
    def create(self, uri: str) -> AbstractProjectFetcher:
        """create"""
        raise NotImplementedError
