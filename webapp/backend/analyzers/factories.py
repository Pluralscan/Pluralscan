# IOC
from pymongo import MongoClient
from cleansecpy.application.usecases.analyzer.list_analysers_use_case import (
    ListAnalyzerUseCase,
)
from cleansecpy.application.usecases.analyzer.new_analyser_use_case import (
    NewAnalyzerUseCase,
)
from cleansecpy.data.mongodb.analyzer.analyzer_repository import MongoAnalyzerRepository
from cleansecpy.data.mongodb.options import MongoRepositoryOptions


def mongo_client():
    """Mongo Client"""
    return MongoClient()


def analyzer_repository():
    """mongo_analyzer_repository"""
    options = MongoRepositoryOptions(mongo_client(), "cleansecpy_test", "analyzers")
    return MongoAnalyzerRepository(options)


def new_analyzer_use_case():
    """new_analyzer_use_case"""
    return NewAnalyzerUseCase(analyzer_repository())


def list_analyzers_use_case():
    """list_analyzers_use_case"""
    return ListAnalyzerUseCase(analyzer_repository())
