import uuid
from typing import Dict, List, Optional

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository
from pluralscan.domain.projects.project_id import ProjectId


class InMemoryPackageRepository(AbstractPackageRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist packages.\n
    WARNING: DOT NOT USE IN PRODUCTION !!!!
    """

    def __init__(self):
        self._packages: Dict[PackageId, Package] = {}

    def next_id(self) -> PackageId:
        return PackageId(uuid.uuid4())

    def find_by_id(self, package_id: PackageId) -> Optional[Package]:
        return self._packages.get(package_id)

    def find_by_project(self, project_id: ProjectId) -> List[Package]:
        return [x for x in self.find_all() if str(x.project_id) == project_id]

    def get_one(self, package_id: PackageId) -> Package:
        package = self._packages.get(package_id)
        if package is None:
            raise ValueError
        return package

    def find_all(self) -> List[Package]:
        packages = self._packages.values()
        return list(packages)

    def update(self, package: Package) -> Package:
        package = self.get_one(package.package_id)
        self._packages[package.package_id] = package

        return package

    def add(self, package: Package) -> Package:
        if package.package_id is None:
            str_uuid = str(uuid.uuid4())
            package.package_id = str_uuid

        self._packages[package.package_id] = package

        return package

    def remove(self, package_id: PackageId):
        package = self.get_one(package_id)
        self._packages.pop(package.package_id)

    def count(self) -> int:
        return len(self._packages.items())
