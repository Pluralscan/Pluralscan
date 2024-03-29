from typing import List

from bson import ObjectId
from pluralscan.data.mongodb.analyzers.analyzer_document import \
    AnalyzerDocument
from pluralscan.data.mongodb.analyzers.analyzer_mapper import AnalyzerMapper
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pluralscan.domain.analyzers.analyzer import Analyzer
from pluralscan.domain.analyzers.analyzer_filter import AnalyzerFilter
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.analyzers.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.shared.technology import Technology
from pymongo import ReturnDocument
from pluralscan.libs.ddd.repositories.page import Page

from pluralscan.libs.ddd.repositories.pagination import Pageable


class MongoAnalyzerRepository(AbstractAnalyzerRepository):
    """Concrete class for storing and access analyzer entities into
    a MongoDB NoSQL Database."""

    def __init__(self, options: MongoRepositoryOptions):
        self._database = options.client[options.database_name]
        self._collection = self._database[options.collection_name]

    def next_id(self) -> AnalyzerId:
        return AnalyzerId(ObjectId())

    def find_by_id_by_id(self, analyzer_id: AnalyzerId) -> Analyzer:
        raise NotImplementedError

    def find_by_id(self, analyzer_id: AnalyzerId) -> Analyzer:
        document = self._collection.find_one({"_id": ObjectId(str(analyzer_id))})
        return AnalyzerMapper.from_document(document)

    def find_many(self, analyzer_ids: List[AnalyzerId]) -> List[Analyzer]:
        raise NotImplementedError

    def find_all(self, pageable: Pageable = Pageable()) -> Page[Analyzer]:
        documents: List[AnalyzerDocument] = []
        for document in self._collection.find():
            documents.append(document)
        return AnalyzerMapper.from_documents(documents)

    def find_by_technologies(self, technologies: List[Technology]) -> List[Analyzer]:
        raise NotImplementedError

    def update(self, analyzer: Analyzer) -> Analyzer:
        analyzer_id = ObjectId(str(analyzer.analyzer_id))
        document_dict = AnalyzerMapper.to_document(analyzer).to_dict()
        document = self._collection.find_one_and_update(
            {'_id': analyzer_id},
            {'$set': document_dict},
            return_document=ReturnDocument.AFTER
        )
        return AnalyzerMapper.from_document(document)

    def add(self, analyzer: Analyzer) -> Analyzer:
        document = AnalyzerMapper.to_document(analyzer)
        document['_id'] = self._collection.insert_one(document).inserted_id
        return AnalyzerMapper.from_document(document)

    def remove(self, analyzer_id: AnalyzerId) -> int:
        result = self._collection.delete_one({'_id': ObjectId(str(analyzer_id))})
        return result.deleted_count

    def count(self, filters: AnalyzerFilter = None) -> int:
        return self._collection.count_documents({})
