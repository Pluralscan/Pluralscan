from dataclasses import dataclass

from enum import Enum
from abc import ABCMeta, abstractmethod
from typing import List

from cleansecpy.domain.source.source import Source


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
class AbstractSourceReader(metaclass=ABCMeta):
    """AbstractSourceReader"""

    @abstractmethod
    def fetch(self, uri: str, options: FetchOptions = FetchOptions()) -> SourceResult:
        """Fetch and save source files into storage destination."""
        raise NotImplementedError

    @abstractmethod
    def read_sources(self, path: str) -> List[Source]:
        """Retrieve sources set from storage."""
        raise NotImplementedError
