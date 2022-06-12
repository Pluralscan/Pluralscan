from bson import ObjectId
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.data.mongodb.scans.scan_document import ScanDocument
from cleansecpy.data.mongodb.scans.scan_validation import ScanRepositoryValidation


# TODO: Abstract seeder
class ScanRepositorySeeder:
    """ScanRepositorySeeder"""

    def __init__(self, options: MongoRepositoryOptions):
        self._collection_name = options.collection_name
        self._database = options.client[options.database_name]
        self._validator = ScanRepositoryValidation(options)

    def seed(self):
        """seed"""
        if self._collection_exists():
            raise Exception()
        self._create_collection_with_validation()
        self._add_packages()

    def reset_and_seed(self):
        """reset_and_seed"""
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

    def _add_packages(self):
        self._database[self._collection_name].insert_many(
            [
                ScanDocument(_id=ObjectId(), name="", path=""),
                ScanDocument(_id=ObjectId(), name="", path=""),
            ]
        )
