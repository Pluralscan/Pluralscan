from abc import ABCMeta, abstractmethod
from typing import List, Optional
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.libs.ddd.repositories.page import Page

from pluralscan.libs.ddd.repositories.pagination import Pageable

from .scan import Scan
from .scan_id import ScanId


class AbstractScanRepository(metaclass=ABCMeta):
    """
    AbstractScanRepository defines a repository contract for Scan Aggregate Root.
    """
    def __del__(self):
        print(f"[!]  Garbage AbstractScanRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> ScanId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, scan_id: ScanId) -> Optional[Scan]:
        """Retrieve a scan by id."""
        raise NotImplementedError()

    @abstractmethod
    def find_all(self, pageable: Pageable = Pageable()) -> Page[Scan]:
        """Get all scans."""
        raise NotImplementedError

    def find_scheduled_by_package(self, package_id: PackageId) -> List[Scan]:
        """Get all scheduled scans for a package."""
        raise NotImplementedError

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
    def remove(self, scan_id: ScanId):
        """Remove a scan."""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """Count how many scans exists in storage."""
        raise NotImplementedError()
