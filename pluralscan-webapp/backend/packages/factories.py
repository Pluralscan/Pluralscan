# IOC
from pluralscan.application.usecases.packages.get_package_list import (
    GetPackageListUseCase,
)
from ..settings import MEMORY_CONTEXT


# Repositories
def memory_package_repository():
    """memory_package_repository"""
    return MEMORY_CONTEXT.package_repository


# Package Use Cases
def list_packages_use_case():
    """list_packages_use_case"""
    return GetPackageListUseCase(memory_package_repository())
