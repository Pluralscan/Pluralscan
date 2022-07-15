# Repositories
from configs.database import MEMORY_CONTEXT
from pluralscan.application.usecases.packages.get_latest_snapshot import (
    GetLatestSnapshotUseCase,
)
from pluralscan.application.usecases.packages.get_package_by_id import GetPackageByIdUseCase
from pluralscan.application.usecases.packages.get_package_list import (
    GetPackageListUseCase,
)


def memory_package_repository():
    """memory_package_repository"""
    return MEMORY_CONTEXT.package_repository


# Package Use Cases
def get_package_list_use_case():
    """list_packages_use_case"""
    return GetPackageListUseCase(memory_package_repository())

def get_package_by_id_use_case():
    """get_package_by_id_use_case"""
    return GetPackageByIdUseCase(memory_package_repository())

def get_latest_snapshot_use_case():
    """get_latest_snapshot_use_case"""
    return GetLatestSnapshotUseCase(memory_package_repository())
