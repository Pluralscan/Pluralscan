import logging
from typing import List
from bson import ObjectId

from pymongo import MongoClient
from cleansecpy.data.mongodb.packages.package_mapper import PackageMapper

from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import AbstractPackageRepository

PACKAGE_COLLECTION_NAME: str = "packages"


class MongoPackageRepository(AbstractPackageRepository):
    """MongoPackageRepository"""
    logger = logging.getLogger(__name__)

    def __init__(self, client: MongoClient):
        self._collection = client.test[PACKAGE_COLLECTION_NAME]

    def find_by_id(self, project_id: str) -> Package:
        document = self._collection.find_one({"_id": ObjectId(project_id)})
        return PackageMapper.from_document(document)

    def get_all(self) -> List[Package]:
        pass

    def update(self, package: Package) -> Package:
        pass

    def add(self, package: Package) -> Package:
        document = PackageMapper.to_document(package)
        document._id = self._collection.insert_one(document).inserted_id
        return PackageMapper.from_document(document)

    def remove(self, project_id: str):
        pass
