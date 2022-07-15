# Repositories
from pluralscan.application.usecases.scans.get_scan_list import GetScanListUseCase
from pluralscan.application.usecases.scans.schedule_scan import ScheduleScanUseCase
from pluralscan.data.inmemory.analyzers.analyzer_repository import (
    InMemoryAnalyzerRepository,
)
from pluralscan.data.inmemory.analyzers.analyzer_seeder import (
    InMemoryAnalyzerRepositorySeeder,
)
from pluralscan.data.inmemory.packages.package_repository import (
    InMemoryPackageRepository,
)
from pluralscan.data.inmemory.packages.package_seeder import (
    InMemoryPackageRepositorySeeder,
)
from pluralscan.data.inmemory.scans.scan_repository import InMemoryScanRepository
from pluralscan.infrastructure.processor.jobs.rq_job_runner import RqJobRunner


def memory_package_repository():
    """memory_package_repository"""
    package_repository = InMemoryPackageRepository()
    InMemoryPackageRepositorySeeder(package_repository).seed()
    return package_repository


def memory_analyzer_repository():
    """memory_analyzer_repository"""
    analyzer_repository = InMemoryAnalyzerRepository()
    InMemoryAnalyzerRepositorySeeder(analyzer_repository).seed()
    return analyzer_repository


def memory_scan_repository():
    """memory_scan_repository"""
    scan_repository = InMemoryScanRepository()
    return scan_repository


# Scans Use Cases
def get_scans_use_case():
    """get_scans_use_case"""
    return GetScanListUseCase(memory_scan_repository())


def shedule_scan_use_case():
    """shedule_scan_use_case"""
    return ScheduleScanUseCase(
        scan_repository=memory_scan_repository(),
        package_repository=memory_package_repository(),
        analyzer_repository=memory_analyzer_repository(),
        job_runner=RqJobRunner(),
    )
