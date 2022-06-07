from typing import Dict, List
import uuid
from cleansecpy.domain.package.package import Package

from cleansecpy.domain.package.package_repository import AbstractPackageRepository


class InMemoryPackageRepository(AbstractPackageRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist packages.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self.packages: Dict[str, Package] = {}

    def find_by_id(self, package_id: str) -> Package:
        return self.packages.get(package_id)

    def get_all(self) -> List[Package]:
        return self.packages

    def update(self, package: Package) -> Package:
        package = self.find_by_id(package.id)

        if package is None:
            raise Exception

        self.packages[package.id] = package

        return package

    def add(self, package: Package) -> Package:
        str_uuid = str(uuid.uuid4())
        package.id = str_uuid

        self.packages[str_uuid] = package

        return package

    def remove(self, package_id: str):
        package = self.find_by_id(package_id)

        if package is None:
            raise Exception

        self.packages.pop(package_id)
