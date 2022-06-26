from pluralscan.application.usecases.analyzer.list_analysers_use_case import \
    ListAnalyzersUseCase
from pluralscan.application.usecases.analyzer.new_analyser_use_case import \
    NewAnalyzerUseCase
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.mongodb.analyzers.analyzer_repository import \
    MongoAnalyzerRepository
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pymongo import MongoClient


# Database Clients
def mongo_client():
    """Mongo Client"""
    return MongoClient()


# Repositories
def analyzer_repository():
    """analyzer_repository"""
    options = MongoRepositoryOptions(mongo_client(), "cleansecpy_test", "analyzers")
    return MongoAnalyzerRepository(options)


def memory_analyzer_repository():
    """memory_analyzer_repository"""
    return InMemoryAnalyzerRepository()


# Analyzer Use Cases
def new_analyzer_use_case():
    """new_analyzer_use_case"""
    return NewAnalyzerUseCase(memory_analyzer_repository())


def list_analyzers_use_case():
    """list_analyzers_use_case"""
    return ListAnalyzersUseCase(memory_analyzer_repository())