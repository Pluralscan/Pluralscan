from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.libs.ddd.repositories.pagination import Pageable


@dataclass(frozen=True)
class GetPackageListQuery:
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
    item_count: int
    page_index: int
    page_count: int
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
            item_count=page.total_items,
            page_index=page.page_number,
            page_count=page.total_pages,
            page_size=page.page_size,
        )
