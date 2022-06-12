from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import AbstractPackageRepository
from cleansecpy.libs.utils.validable import Validable

# Input
@dataclass(frozen=True)
class ListPackagesCommand(Validable):
    """List Packages Command"""

    limit: int = 100
    offset: int = 0


# Output
@dataclass(frozen=True)
class ListPackagesResult:
    """ListPackagesResult"""

    packages: List[Package]


# Contract
class AbstractListPackagesUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListPackagesUseCase"""

    @abstractmethod
    def handle(self, command: ListPackagesCommand) -> ListPackagesResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class ListPackagesUseCase(
    AbstractListPackagesUseCase
):  # pylint: disable=too-few-public-methods
    """ListPackagesUseCase"""

    def __init__(self, package_repository: AbstractPackageRepository):
        self._package_repository = package_repository

    def handle(self, command: ListPackagesCommand) -> ListPackagesResult:
        packages = self._package_repository.get_all()
        return ListPackagesResult(packages)
