from bson import ObjectId
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.data.mongodb.packages.package_document import PackageDocument
from cleansecpy.data.mongodb.packages.package_validation import (
    PackageRepositoryValidation,
)

# TODO: Abstract seeder.
class PackageRepositorySeeder:
    """PackageRepositorySeeder"""

    def __init__(self, options: MongoRepositoryOptions):
        self._collection_name = options.collection_name
        self._database = options.client[options.database_name]
        self._validator = PackageRepositoryValidation(options)

    def seed(self):
        if self._collection_exists():
            raise Exception()
        self._create_collection_with_validation()
        self._add_documents()

    def reset_and_seed(self):
        self._drop_collection()
        self.seed()

    def _collection_exists(self) -> bool:
        collection_exists = (
            self._collection_name in self._database.list_collection_names()
        )
        return collection_exists

    def _create_collection_with_validation(self):
        self._database.create_collection(self._collection_name)
        self._validator.execute_on_existing_collection()

    def _drop_collection(self):
        self._database[self._collection_name].drop()

    def _add_documents(self):
        self._database[self._collection_name].insert_many(
            [
                PackageDocument(_id=ObjectId(), name="", path=""),
                PackageDocument(_id=ObjectId(), name="", path=""),
            ]
        )
