# Repositories
from pluralscan.application.usecases.scans.get_scans import GetScansUseCase
from pluralscan.application.usecases.scans.schedule_scan import \
    ScheduleScanUseCase
from pluralscan.data.inmemory.analyzers.analyzer_repository import \
    InMemoryAnalyzerRepository
from pluralscan.data.inmemory.analyzers.analyzer_seeder import \
    AnalyzerInMemoryRepositorySeeder
from pluralscan.data.inmemory.diagnosis.diagnosis_repository import \
    InMemoryDiagnosisRepository
from pluralscan.data.inmemory.executables.executable_repository import \
    InMemoryExecutableRepository
from pluralscan.data.inmemory.executables.executable_seeder import \
    ExecutableInMemoryRepositorySeeder
from pluralscan.data.inmemory.scans.scan_repository import \
    InMemoryScanRepository
from pluralscan.infrastructure.processor.fetchers.package_fetcher_factory import \
    PackageFetcherFactory
from pluralscan.infrastructure.processor.jobs.rq_job_runner import RqJobRunner


def memory_package_repository():
    """memory_package_repository"""
    analyzer_repository = InMemoryAnalyzerRepository()
    AnalyzerInMemoryRepositorySeeder(analyzer_repository, memory_executable_repository()).seed()
    return analyzer_repository

def memory_executable_repository():
    """memory_executable_repository"""
    executable_repository = InMemoryExecutableRepository()
    ExecutableInMemoryRepositorySeeder(executable_repository).seed()
    return executable_repository

def memory_scan_repository():
    """memory_scan_repository"""
    scan_repository = InMemoryScanRepository()
    return scan_repository

def memory_diagnosis_repository():
    """memory_diagnosis_repository"""
    diagnosis_repository = InMemoryDiagnosisRepository()
    return diagnosis_repository

# Scans Use Cases
def get_scans_use_case():
    """get_scans_use_case"""
    return GetScansUseCase(memory_scan_repository())

def new_scan_use_case():
    """new_scan_use_case"""
    pass

def shedule_scan_use_case():
    """shedule_scan_use_case"""
    return ScheduleScanUseCase(
        scan_repository=memory_scan_repository(),
        package_repository=memory_package_repository(),
        executable_repository=memory_executable_repository(),
        package_fetcher_factory=PackageFetcherFactory(),
        job_runner=RqJobRunner()
    )
