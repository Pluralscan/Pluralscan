from abc import ABCMeta, abstractmethod
from dataclasses import dataclass


@dataclass
class PackageFetcherOptions:
    """PackageFetcherOptions"""

    output_dir: str = None
    credentials = None
    overwrite: bool = True


@dataclass
class PackageFetcherResult:
    """PackageFetcherResult"""

    output_dir: str = None
    error: str = None
    success: bool = error is None


class AbstractPackageFetcher(metaclass=ABCMeta):
    """AbstractPackageFetcher"""

    @abstractmethod
    def __init__(self, options: PackageFetcherOptions()):
        self._options = options

    @abstractmethod
    def download(self, uri: str) -> PackageFetcherResult:
        """download"""
        raise NotImplementedError
