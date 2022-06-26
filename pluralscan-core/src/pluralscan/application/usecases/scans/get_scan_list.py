from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.libs.utils.validable import Validable


# Input
@dataclass(frozen=True)
class ListScansCommand(Validable):
    """List Analyzer Command"""

    limit: int = 100


# Output
@dataclass(frozen=True)
class ListScansResult:
    """ListScansResult"""

    analyzers: List[Scan]


# Contract
class AbstractListScansUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListScansUseCase"""

    @abstractmethod
    def handle(self, command: ListScansCommand) -> ListScansResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class ListScansUseCase(
    AbstractListScansUseCase
):  # pylint: disable=too-few-public-methods
    """ListScansUseCase"""

    def __init__(self, scan_repository: AbstractScanRepository):
        self._scan_repository = scan_repository

    def handle(self, command: ListScansCommand) -> ListScansResult:
        analyzers = self._scan_repository.get_all()
        return ListScansResult(analyzers)
