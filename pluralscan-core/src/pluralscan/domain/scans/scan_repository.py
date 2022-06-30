from abc import ABCMeta, abstractmethod
from typing import List

from .scan import Scan
from .scan_id import ScanId


class AbstractScanRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for scan persistence.
    """
    def __del__(self):
        print(f"[!]  Garbage ScanRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> ScanId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_by_id(self, scan_id: ScanId) -> Scan:
        """Retrieve a scan by id."""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Scan]:
        """Get all scans."""
        raise NotImplementedError()

    @abstractmethod
    def add(self, scan: Scan) -> Scan:
        """Add a new scan."""
        raise NotImplementedError()

    @abstractmethod
    def add_bulk(self, scans: List[Scan]) -> List[Scan]:
        """Add many scans into storage."""
        raise NotImplementedError()

    @abstractmethod
    def update(self, scan: Scan) -> Scan:
        """Update an existing scan."""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, scan_id: str):
        """Remove a scan."""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """Count how many scans exists in storage."""
        raise NotImplementedError()
