from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional

from pluralscan.domain.packages.package_origin import PackageOrigin
from pluralscan.domain.technologies.language import Language


@dataclass(frozen=True)
class DownloadPackageResult:
    """DownloadPackageResult"""

    output_dir: Optional[str] = None
    error: Optional[str] = None
    success: bool = error is None


@dataclass(frozen=True)
class PackageInfoResult:
    """Data returned when querying a package details."""

    name: Optional[str] = None
    full_name: Optional[str] = None
    description: Optional[str] = None
    version: Optional[str] = None
    url: Optional[str] = None
    languages: List[Language] = field(default_factory=list)
    error: Optional[str] = None
    success: bool = error is None


class AbstractPackageFetcher(metaclass=ABCMeta):
    """Abstract interactor contract for fetching a source code package from an external source."""

    @abstractmethod
    def can_fetch(self, uri: str) -> bool:
        """Check if the package is accessible at the specified uri."""
        raise NotImplementedError

    @abstractmethod
    def get_info(self, uri: str) -> PackageInfoResult:
        """Retrieve package information at the specified uri."""
        raise NotImplementedError

    @abstractmethod
    def download(self, uri: str, output_dir: str) -> DownloadPackageResult:
        """Download and save package to fetcher output directory."""
        raise NotImplementedError


class AbstractPackageFetcherFactory(metaclass=ABCMeta):
    """AbstractPackageFetcherFactory"""

    @abstractmethod
    def create(self, uri: str) -> AbstractPackageFetcher:
        """create"""
        raise NotImplementedError
