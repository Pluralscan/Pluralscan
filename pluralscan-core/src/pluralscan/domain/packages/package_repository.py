from abc import ABCMeta, abstractmethod
from typing import List, Optional

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.libs.ddd.repositories.page import Page
from pluralscan.libs.ddd.repositories.pagination import Pageable


class AbstractPackageRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for package persistence.
    """

    def __del__(self):
        print(f"[!]  Garbage PackageRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> PackageId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, package_id: PackageId) -> Optional[Package]:
        """Find package by id or return None."""
        raise NotImplementedError()

    @abstractmethod
    def find_by_project(self, project_id: ProjectId) -> List[Package]:
        """Get packages by project identifier."""
        raise NotImplementedError()

    @abstractmethod
    def get_one(self, package_id: PackageId) -> Package:
        """Get a package by id."""
        raise NotImplementedError()

    @abstractmethod
    def find_all(self, pageable: Pageable = Pageable()) -> Page[Package]:
        """Get all packages."""
        raise NotImplementedError()

    @abstractmethod
    def add(self, package: Package):
        """Add a new package."""
        raise NotImplementedError()

    @abstractmethod
    def update(self, package: Package) -> Package:
        """Update an existing package."""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, package_id: PackageId):
        """Remove a package."""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """count"""
        raise NotImplementedError()
