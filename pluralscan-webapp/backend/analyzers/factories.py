from pluralscan.application.usecases.analyzers.get_analyzer_list import \
    GetAnalyzerListUseCase
from pluralscan.application.usecases.analyzers.new_analyzer_use_case import \
    NewAnalyzerUseCase
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    AnalyzerInMemoryRepositorySeeder
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    ExecutableInMemoryRepositorySeeder
from pluralscan.data.mongodb.analyzers.analyzer_repository import \
    MongoAnalyzerRepository
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pymongo import MongoClient


# Database Clients
def mongo_client():
    """Mongo Client"""
    return MongoClient()


# Repositories
def mongo_analyzer_repository():
    """analyzer_repository"""
    options = MongoRepositoryOptions(mongo_client(), "cleansecpy_test", "analyzers")
    return MongoAnalyzerRepository(options)


def memory_executable_repository():
    """memory_executable_repository"""
    executable_repository = InMemoryExecutableRepository()
    ExecutableInMemoryRepositorySeeder(executable_repository).seed()
    return executable_repository


def memory_analyzer_repository():
    """memory_analyzer_repository"""
    analyzer_repository = InMemoryAnalyzerRepository()
    AnalyzerInMemoryRepositorySeeder(
        analyzer_repository, memory_executable_repository()
    ).seed()
    return analyzer_repository


# Analyzer Use Cases
def new_analyzer_use_case():
    """new_analyzer_use_case"""
    return NewAnalyzerUseCase(memory_analyzer_repository())


def get_analyzer_list_use_case():
    """list_analyzers_use_case"""
    return GetAnalyzerListUseCase(memory_analyzer_repository())
