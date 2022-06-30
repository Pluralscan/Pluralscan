from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.libs.utils.validable import Validable


# Input
@dataclass(frozen=True)
class GetScansCommand(Validable):
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class GetScansResult:
    """GetScansResult"""

    analyzers: List[Scan]


# Contract
class AbstractGetScansUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetScansUseCase"""

    @abstractmethod
    def handle(self, command: GetScansCommand) -> GetScansResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetScansUseCase(
    AbstractGetScansUseCase
):  # pylint: disable=too-few-public-methods
    """GetScansUseCase"""

    def __init__(self, scan_repository: AbstractScanRepository):
        self._scan_repository = scan_repository

    def handle(self, command: GetScansCommand) -> GetScansResult:
        analyzers = self._scan_repository.get_all()
        return GetScansResult(analyzers)
