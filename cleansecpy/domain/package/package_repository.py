from abc import ABCMeta, abstractmethod
from typing import List
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_id import PackageId


class PackageRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for package persistence.
    """
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
