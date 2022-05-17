from cleansecpy.data.inmemory.package_repository import InMemoryPackageRepository
from cleansecpy.data.mongodb.package.package_repository import MongoPackageRepository


class AbstractRepositoryFactory():
    """This factory class provide helper methods for craft concrete repositories."""
    @staticmethod
    def package_repository(repo_type: str):
        """package_repository"""
        if repo_type == "memory":
            return InMemoryPackageRepository()
        if repo_type == "mongo":
            return MongoPackageRepository()
        raise ValueError(
            "Unmanaged type provide to package repository factory.")

    @staticmethod
    def project_repository(repo_type: str):
        """project_repository"""
        pass
