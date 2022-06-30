# IOC
from pluralscan.application.processors.fetchers.package_fetcher import \
    AbstractPackageFetcher
from pluralscan.application.usecases.packages.get_package_list import \
    ListPackagesUseCase
from pluralscan.application.usecases.packages.get_remote_package_info import \
    GetRemotePackageInfoUseCase
from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pluralscan.data.mongodb.packages.package_repository import \
    MongoPackageRepository
from pluralscan.infrastructure.processor.fetchers.git_package_fetcher import \
    GitPackageFetcher
from pymongo import MongoClient


# Database Clients
def mongo_client():
    """Mongo Client"""
    return MongoClient()


# Repositories
def package_repository():
    """package_repository"""
    options = MongoRepositoryOptions(mongo_client(), "cleansecpy_test", "packages")
    return MongoPackageRepository(options)

def memory_package_repository():
    """memory_package_repository"""
    return InMemoryPackageRepository()


# Fetchers
def git_package_fetcher():
    """git_package_fetcher"""
    return GitPackageFetcher()


# Package Use Cases
def list_packages_use_case():
    """list_packages_use_case"""
    return ListPackagesUseCase(package_repository())

def get_remote_package_info_use_case(package_fetcher: AbstractPackageFetcher):
    """get_remote_package_info_use_case"""
    return GetRemotePackageInfoUseCase(package_fetcher)
