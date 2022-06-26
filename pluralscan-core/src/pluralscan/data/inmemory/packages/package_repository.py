import uuid
from typing import Dict, List

from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.package.package_repository import \
    AbstractPackageRepository


class InMemoryPackageRepository(AbstractPackageRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist packages.\n
    WARNING: DOT NOT USE IN PRODUCTION !!!!
    """

    def __init__(self):
        self._packages: Dict[str, Package] = {}

    def next_id(self) -> PackageId:
        return PackageId(uuid.uuid4())

    def find_by_id(self, package_id: PackageId) -> Package:
        return self._packages.get(package_id)

    def find_by_name(self, name: str) -> Package:
        for package in self._packages.values():
            if package.name == name:
                return package
        return None

    def find_by_location(self, location: str) -> Package:
        for package in self._packages.values():
            if package.location == location:
                return package
        return None

    def get_all(self) -> List[Package]:
        return self._packages

    def update(self, package: Package) -> Package:
        package = self.find_by_id(package.package_id)

        if package is None:
            raise Exception

        self._packages[package.package_id] = package

        return package

    def add(self, package: Package) -> Package:
        if package.package_id is None:
            str_uuid = str(uuid.uuid4())
            package.package_id = str_uuid

        self._packages[package.package_id] = package

        return package

    def remove(self, package_id: str):
        package = self.find_by_id(package_id)

        if package is None:
            raise Exception

        self._packages.pop(package_id)

    def count(self) -> int:
        return len(self._packages.items())
