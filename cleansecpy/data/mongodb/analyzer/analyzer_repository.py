from typing import List
from bson import ObjectId
from pymongo import ReturnDocument
from cleansecpy.data.mongodb.analyzer.analyzer_document import AnalyzerDocument
from cleansecpy.data.mongodb.analyzer.analyzer_mapper import AnalyzerMapper
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository


class MongoAnalyzerRepository(AbstractAnalyzerRepository):
    """Concrete class for storing and access analyzer entities into
    a MongoDB NoSQL Database."""

    def __init__(self, options: MongoRepositoryOptions):
        self._database = options.client[options.database_name]
        self._collection = self._database[options.collection_name]

    def next_id(self) -> AnalyzerId:
        return AnalyzerId(ObjectId())

    def find_by_id(self, analyzer_id: str) -> Analyzer:
        document = self._collection.find_one({"_id": ObjectId(analyzer_id)})
        return AnalyzerMapper.from_document(document)

    def get_all(self) -> List[Analyzer]:
        documents: List[AnalyzerDocument] = []
        for document in self._collection.find():
            documents.append(document)
        return AnalyzerMapper.from_documents(documents)

    def update(self, analyzer: Analyzer) -> Analyzer:
        analyzer_id = ObjectId(analyzer.analyzer_id)
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

    def remove(self, analyzer_id: str) -> int:
        result = self._collection.delete_one({'_id': ObjectId(analyzer_id)})
        return result.deleted_count

    def count(self) -> int:
        return self._collection.count_documents({})
