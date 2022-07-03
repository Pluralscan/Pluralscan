from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository


@dataclass(frozen=True)
class GetPackageByIdResult:
    """GetPackageByIdResult"""

    package: Package


# Contract
class AbstractGetPackageByIdUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetPackageByIdUseCase"""

    @abstractmethod
    def handle(self, package_id: PackageId) -> GetPackageByIdResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetPackageByIdUseCase(
    AbstractGetPackageByIdUseCase
):  # pylint: disable=too-few-public-methods
    """GetPackageByIdUseCase"""

    def __init__(self, package_repository: AbstractPackageRepository):
        self._package_repository = package_repository

    def handle(self, package_id: PackageId) -> GetPackageByIdResult:
        package = self._package_repository.get_one(package_id=package_id)
        return GetPackageByIdResult(package)
