from abc import ABCMeta, abstractmethod
from typing import List
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId


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
    def find_by_id(self, package_id: PackageId) -> Package:
        """Find package by id."""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Package]:
        """Get all packages."""
        raise NotImplementedError()

    @abstractmethod
    def add(self, package: Package) -> Package:
        """Add a new package."""
        raise NotImplementedError()

    @abstractmethod
    def update(self, package: Package) -> Package:
        """Update an existing package."""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, package_id: str):
        """Remove a package."""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """count"""
        raise NotImplementedError()
