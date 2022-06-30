from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository
from pluralscan.libs.utils.validable import Validable


@dataclass(frozen=True)
class GetPackageListCommand(Validable):
    """List Packages Command"""

    limit: int = 100
    offset: int = 0


@dataclass(frozen=True)
class GetPackageListResult:
    """GetPackageListResult"""

    packages: List[Package]


# Contract
class AbstractGetPackageListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListPackagesUseCase"""

    @abstractmethod
    def handle(self, command: GetPackageListCommand) -> GetPackageListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetPackageListUseCase(
    AbstractGetPackageListUseCase
):  # pylint: disable=too-few-public-methods
    """ListPackagesUseCase"""

    def __init__(self, package_repository: AbstractPackageRepository):
        self._package_repository = package_repository

    def handle(self, command: GetPackageListCommand) -> GetPackageListResult:
        packages = self._package_repository.get_all()
        return GetPackageListResult(packages)
