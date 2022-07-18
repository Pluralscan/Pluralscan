from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.libs.ddd.repositories.pagination import Pageable


# Input
@dataclass(frozen=True)
class GetScanListQuery:
    """Query parameters used for fetch list of scans."""

    page: int = 1
    """
    Page number (default: 1).
    """

    limit: int = 15
    """
    The number of scans to return per page,
    up to a maximum of 100 (default: 15).
    """


# Output
@dataclass(frozen=True)
class GetScanListResult:
    """GetScanListResult"""

    scans: List[Scan]
    item_count: int
    page_index: int
    page_count: int
    page_size: int



# Contract
class AbstractGetScanListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetScanListUseCase"""

    @abstractmethod
    def handle(self, query: GetScanListQuery) -> GetScanListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetScanListUseCase(
    AbstractGetScanListUseCase
):  # pylint: disable=too-few-public-methods
    """GetScanListUseCase"""

    def __init__(self, scan_repository: AbstractScanRepository):
        self._scan_repository = scan_repository

    def handle(self, query: GetScanListQuery) -> GetScanListResult:
        page = self._scan_repository.find_all(Pageable(query.page, query.limit))

        return GetScanListResult(
            scans=page.items,
            item_count=page.total_items,
            page_index=page.page_number,
            page_count=page.total_pages,
            page_size=page.page_size,
        )
