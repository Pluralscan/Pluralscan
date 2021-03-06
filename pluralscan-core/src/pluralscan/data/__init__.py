from pluralscan.data.inmemory.packages.package_repository import \
    InMemoryPackageRepository
from pluralscan.data.mongodb.packages.package_repository import \
    MongoPackageRepository
from pymongo import MongoClient


class AbstractRepositoryFactory:
    """This factory class provide helper methods for craft concrete repositories."""

    @staticmethod
    def package_repository(repo_type: str):
        """package_repository"""
        if repo_type == "memory":
            return InMemoryPackageRepository()
        if repo_type == "mongo":
            return MongoPackageRepository(MongoClient())
        raise ValueError("Unmanaged type provide to package repository factory.")

    @staticmethod
    def project_repository(repo_type: str):
        """project_repository"""
        pass
