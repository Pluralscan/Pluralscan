from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_repository import AbstractScanRepository


# Output
@dataclass(frozen=True)
class GetScanByIdResult:
    """GetScanByIdResult"""

    analyzers: List[Scan]


# Contract
class AbstractGetScanByIdUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetScanByIdUseCase"""

    @abstractmethod
    def handle(self, scan_id: ScanId) -> GetScanByIdResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetScanByIdUseCase(
    AbstractGetScanByIdUseCase
):  # pylint: disable=too-few-public-methods
    """GetScanByIdUseCase"""

    def __init__(self, scan_repository: AbstractScanRepository):
        self._scan_repository = scan_repository

    def handle(self, scan_id: ScanId) -> GetScanByIdResult:
        analyzers = self._scan_repository.get_all()
        return GetScanByIdResult(analyzers)
