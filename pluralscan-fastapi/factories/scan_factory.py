from configs.database import MEMORY_CONTEXT
from pluralscan.application.usecases.scans.get_scan_list import GetScanListUseCase


def memory_scan_repository():
    """memory_scan_repository"""
    return MEMORY_CONTEXT.scan_repository

def get_scan_list_use_case():
    """get_scan_list_use_case"""
    return GetScanListUseCase(memory_scan_repository())
