from configs.database import MEMORY_CONTEXT
from factories.analyzer_factory import memory_analyzer_repository
from factories.package_factory import memory_package_repository
from pluralscan.application.usecases.scans.get_scan_by_id import GetScanByIdUseCase
from pluralscan.application.usecases.scans.get_scan_list import GetScanListUseCase
from pluralscan.application.usecases.scans.launch_package_scan import ScanPackageUseCase
from pluralscan.application.usecases.scans.schedule_package_scan import ScheduleScanUseCase
from pluralscan.infrastructure.processor.executables.exec_runner_factory import (
    ExecRunnerFactory,
)
from pluralscan.infrastructure.processor.reports.report_processor_factory import (
    ReportProcessorFactory,
)

# Repositories
def memory_scan_repository():
    """memory_scan_repository"""
    return MEMORY_CONTEXT.scan_repository


# Use cases
def get_scan_list_use_case():
    """get_scan_list_use_case"""
    return GetScanListUseCase(memory_scan_repository())

def get_scan_by_id_use_case():
    """get_scan_by_id_use_case"""
    return GetScanByIdUseCase(memory_scan_repository())


def schedule_scan_use_case():
    """schedule_scan_use_case"""
    return ScheduleScanUseCase(
        scan_repository=memory_scan_repository(),
        package_repository=memory_package_repository(),
        analyzer_repository=memory_analyzer_repository(),
        job_runner=None, # TODO: not recommended for production
    )


def execute_scan_use_case():
    """execute_scan_use_case"""
    return ScanPackageUseCase(
        scan_repository=memory_scan_repository(),
        analyzer_repository=memory_analyzer_repository(),
        package_repository=memory_package_repository(),
        exec_runner_factory=ExecRunnerFactory(),
        report_processor_factory=ReportProcessorFactory(),
    )

# Event Handlers