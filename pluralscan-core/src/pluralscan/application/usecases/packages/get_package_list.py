from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.libs.ddd.repositories.pagination import Pageable
from pluralscan.libs.utils.validable import Validable


@dataclass(frozen=True)
class GetPackageListQuery(Validable):
    """List Packages Command"""

    page: int = 1
    """
    Page number (default: 1).
    """

    limit: int = 15
    """
    The number of analyzers to return per page,
    up to a maximum of 100 (default: 15).
    """


@dataclass(frozen=True)
class GetPackageListResult:
    """GetPackageListResult"""

    packages: List[Package]
    total_items: int
    page_number: int
    total_page: int
    page_size: int


# Contract
class AbstractGetPackageListUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractListPackagesUseCase"""

    @abstractmethod
    def handle(self, query: GetPackageListQuery) -> GetPackageListResult:
        """handle"""
        raise NotImplementedError


# Default Implementation
class GetPackageListUseCase(
    AbstractGetPackageListUseCase
):  # pylint: disable=too-few-public-methods
    """ListPackagesUseCase"""

    def __init__(self, package_repository: AbstractPackageRepository):
        self._package_repository = package_repository

    def handle(self, query: GetPackageListQuery) -> GetPackageListResult:
        page = self._package_repository.find_all(Pageable(query.page, query.limit))

        return GetPackageListResult(
            packages=page.items,
            total_items=page.total_items,
            page_number=page.page_number,
            total_page=page.total_pages,
            page_size=page.page_size,
        )
