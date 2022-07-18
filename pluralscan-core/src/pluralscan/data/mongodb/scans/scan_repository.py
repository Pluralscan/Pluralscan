from typing import List

from bson import ObjectId
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pluralscan.data.mongodb.scans.scan_document import ScanDocument
from pluralscan.data.mongodb.scans.scan_mapper import ScanMapper
from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_repository import AbstractScanRepository


class MongoScanRepository(AbstractScanRepository):
    """MongoScanRepository"""

    def __init__(self, options: MongoRepositoryOptions):
        self._database = options.client[options.database_name]
        self._collection = self._database[options.collection_name]

    def next_id(self) -> ScanId:
        return ScanId(ObjectId())

    def get_by_id(self, scan_id: str) -> Scan:
        document = self._collection.find_one({"_id": ObjectId(scan_id)})
        return ScanMapper.from_document(document)

    def find_all(self) -> List[Scan]:
        documents: List[ScanDocument] = []
        for document in self._collection.find():
            documents.append(document)
        return ScanMapper.from_documents(documents)

    def update(self, scan: Scan) -> Scan:
        raise NotImplementedError

    def add(self, scan: Scan) -> Scan:
        document = ScanMapper.to_document(scan)
        document["_id"] = self._collection.insert_one(document).inserted_id
        return ScanMapper.from_document(document)

    def remove(self, scan_id: str):
        raise NotImplementedError
    
    def count(self) -> int:
        raise NotImplementedError

    def add_bulk(self, scans: List[Scan]) -> List[Scan]:
        raise NotImplementedError
