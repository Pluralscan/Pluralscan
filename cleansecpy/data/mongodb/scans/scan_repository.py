from typing import List
from bson import ObjectId
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.data.mongodb.scans.scan_document import ScanDocument
from cleansecpy.data.mongodb.scans.scan_mapper import ScanMapper
from cleansecpy.domain.scans.scan import Scan
from cleansecpy.domain.scans.scan_id import ScanId

from cleansecpy.domain.scans.scan_repository import AbstractScanRepository


class MongoScanRepository(AbstractScanRepository):
    """MongoScanRepository"""

    def __init__(self, options: MongoRepositoryOptions):
        self._database = options.client[options.database_name]
        self._collection = self._database[options.collection_name]

    def next_id(self) -> ScanId:
        return ScanId(ObjectId())

    def find_by_id(self, scan_id: str) -> Scan:
        document = self._collection.find_one({"_id": ObjectId(scan_id)})
        return ScanMapper.from_document(document)

    def get_all(self) -> List[Scan]:
        documents: List[ScanDocument] = []
        for document in self._collection.find():
            documents.append(document)
        return ScanMapper.from_documents(documents)

    def update(self, scan: Scan) -> Scan:
        pass

    def add(self, scan: Scan) -> Scan:
        document = ScanMapper.to_document(scan)
        document["_id"] = self._collection.insert_one(document).inserted_id
        return ScanMapper.from_document(document)

    def remove(self, scan_id: str):
        pass
