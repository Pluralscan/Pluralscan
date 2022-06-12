from abc import ABCMeta, abstractmethod
from dataclasses import dataclass


@dataclass
class PackageFetcherOptions:
    """PackageFetcherOptions"""

    output_dir: str = None
    credentials = None

@dataclass
class DownloadPackageResult:
    """DownloadPackageResult"""

    output_dir: str = None
    error: str = None
    success: bool = error is None

@dataclass
class PackageInfoResult:
    """Data returned when querying a package details."""
    name: str = None
    full_name: str = None
    error: str = None
    success: bool = error is None

class AbstractPackageFetcher(metaclass=ABCMeta):
    """AbstractPackageFetcher"""

    @abstractmethod
    def __init__(self, options: PackageFetcherOptions = PackageFetcherOptions()):
        self._options: PackageFetcherOptions = options

    @abstractmethod
    def can_fetch(self, uri: str) -> bool:
        """Check if the package is accessible at the specified uri."""
        raise NotImplementedError

    @abstractmethod
    def get_info(self, uri: str) -> PackageInfoResult:
        """Retrieve package information at the specified uri."""
        raise NotImplementedError

    @abstractmethod
    def download(self, uri: str) -> DownloadPackageResult:
        """Download and save package to fetcher output directory."""
        raise NotImplementedError
