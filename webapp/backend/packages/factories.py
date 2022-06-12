# IOC
from pymongo import MongoClient
from cleansecpy.application.processors.fetchers.package_fetcher import AbstractPackageFetcher
from cleansecpy.application.usecases.package.get_remote_package_info_use_case import (
    GetRemotePackageInfoUseCase,
)
from cleansecpy.application.usecases.package.list_packages_use_case import ListPackagesUseCase
from cleansecpy.data.inmemory.packages.package_repository import InMemoryPackageRepository
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.data.mongodb.packages.package_repository import MongoPackageRepository
from cleansecpy.infrastructure.processor.fetchers.git_package_fetcher import (
    GitPackageFetcher,
)

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
