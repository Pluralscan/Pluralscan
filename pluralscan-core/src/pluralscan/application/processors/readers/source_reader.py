from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.sources.source import Source


# Contract
class AbstractSourceReader(metaclass=ABCMeta):
    """AbstractSourceReader"""

    @abstractmethod
    def read_sources(self, path: str) -> List[Source]:
        """Retrieve sources set from storage."""
        raise NotImplementedError
