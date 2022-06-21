from typing import List
from bson import ObjectId
from pluralscan.data.mongodb.options import MongoRepositoryOptions

from pluralscan.data.mongodb.packages.package_document import PackageDocument
from pluralscan.data.mongodb.packages.package_mapper import PackageMapper

from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.package.package_repository import AbstractPackageRepository


class MongoPackageRepository(AbstractPackageRepository):
    """MongoPackageRepository"""

    def __init__(self, options: MongoRepositoryOptions):
        self._database = options.client[options.database_name]
        self._collection = self._database[options.collection_name]

    def next_id(self) -> PackageId:
        return PackageId(ObjectId())

    def find_by_id(self, package_id: str) -> Package:
        document = self._collection.find_one({"_id": ObjectId(package_id)})
        return PackageMapper.from_document(document)

    def get_all(self) -> List[Package]:
        documents: List[PackageDocument] = []
        for document in self._collection.find():
            documents.append(document)
        return PackageMapper.from_documents(documents)

    def update(self, package: Package) -> Package:
        pass

    def add(self, package: Package) -> Package:
        document = PackageMapper.to_document(package)
        document["_id"] = self._collection.insert_one(document).inserted_id
        return PackageMapper.from_document(document)

    def remove(self, package_id: str):
        pass

    def count(self) -> int:
        pass
