from typing import Dict, List
import uuid
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.package.package_origin import PackageOrigin

from pluralscan.domain.package.package_repository import AbstractPackageRepository
from pluralscan.domain.package.package_type import PackageType


class InMemoryPackageRepository(AbstractPackageRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist packages.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._packages: Dict[str, Package] = {
            "CleanSecPy": Package(
                package_id=PackageId("CleanSecPy"),
                name="CleanSecPy",
                description="",
                origin=PackageOrigin.GIT,
                type=PackageType.POETRY,
                location="https://github.com/gromatluidgi/pluralscan.git"
            )
        }

    def next_id(self) -> PackageId:
        return PackageId(uuid.uuid4())

    def find_by_id(self, package_id: str) -> Package:
        return self._packages.get(package_id)

    def get_all(self) -> List[Package]:
        return self._packages

    def update(self, package: Package) -> Package:
        package = self.find_by_id(package.id)

        if package is None:
            raise Exception

        self._packages[package.package_id] = package

        return package

    def add(self, package: Package) -> Package:
        str_uuid = str(uuid.uuid4())
        package.package_id = str_uuid

        self._packages[str_uuid] = package

        return package

    def remove(self, package_id: str):
        package = self.find_by_id(package_id)

        if package is None:
            raise Exception

        self._packages.pop(package_id)

    def count(self) -> int:
        return len(self._packages.items())
