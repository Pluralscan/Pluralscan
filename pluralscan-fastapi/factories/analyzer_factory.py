# Database Clients
from pymongo import MongoClient
from configs.database import MEMORY_CONTEXT
from pluralscan.application.usecases.analyzers.get_analyzers_by_technologies import FindAnalyzersByTechnologiesUseCase
from pluralscan.application.usecases.analyzers.get_analyzer_list import GetAnalyzerListUseCase
from pluralscan.application.usecases.analyzers.new_analyzer_use_case import NewAnalyzerUseCase
from pluralscan.data.mongodb.analyzers.analyzer_repository import MongoAnalyzerRepository
from pluralscan.data.mongodb.options import MongoRepositoryOptions

# Persistence
def mongo_client():
    """Mongo Client"""
    return MongoClient()


# Repositories
def mongo_analyzer_repository():
    """analyzer_repository"""
    options = MongoRepositoryOptions(mongo_client(), "pluralscan_test", "analyzers")
    return MongoAnalyzerRepository(options)

def memory_analyzer_repository():
    """memory_analyzer_repository"""
    return MEMORY_CONTEXT.analyzer_repository


# Analyzer Use Cases
def new_analyzer_use_case():
    """new_analyzer_use_case"""
    return NewAnalyzerUseCase(memory_analyzer_repository())

def get_analyzer_list_use_case():
    """list_analyzers_use_case"""
    return GetAnalyzerListUseCase(memory_analyzer_repository())

def find_analyzers_by_technologies_use_case():
    """find_analyzers_by_technologies_use_case"""
    return FindAnalyzersByTechnologiesUseCase(memory_analyzer_repository())

# Event Handlers
