from dataclasses import dataclass

from enum import Enum
from abc import ABCMeta, abstractmethod

from cleansecpy.domain.source.source_collection import SourceCollection


# Input
@dataclass
class FetchOptions():
    """FetchOptions"""
    def __init__(self, overwrite=True):
        self._overwrite = overwrite

    @property
    def overwrite(self) -> bool:
        """overwrite"""
        return self._overwrite

    @overwrite.setter
    def overwrite(self, value):
        self._overwrite = value

# Ouput
@dataclass
class SourceResultType(Enum):
    """SourceResultType"""
    ARCHIVE = 'archive'
    DIRECTORY = 'directory'


@dataclass
class SourceResult:
    """SourceResult"""
    path: str
    type: SourceResultType

# Contract
class AbstractSourceService(metaclass=ABCMeta):
    """AbstractSourceService"""

    @abstractmethod
    def fetch(self, uri: str, options: FetchOptions = FetchOptions()) -> SourceResult | Exception:
        """Fetch and save source files into storage destination."""
        raise NotImplementedError

    @abstractmethod
    def read_sources(self, path: str) -> SourceCollection:
        """Retrieve sources set from storage."""
        raise NotImplementedError
