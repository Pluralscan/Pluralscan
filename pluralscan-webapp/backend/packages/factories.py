# IOC
from pluralscan.application.usecases.packages.get_package_list import (
    GetPackageListUseCase,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)


# Repositories
def memory_package_repository():
    """memory_package_repository"""
    return InMemoryPackageRepository()


# Package Use Cases
def list_packages_use_case():
    """list_packages_use_case"""
    return GetPackageListUseCase(memory_package_repository())
