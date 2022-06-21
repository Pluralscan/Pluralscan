from dataclasses import dataclass
from typing import Set
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.domain.diagnosys.diagnosys_id import DiagnosysId


@dataclass
class Scan:
    """Scan Aggregate."""

    scan_id: ScanId = None
    created_on: str = None
    modified_on: str = None
    analyzers: Set[AnalyzerId] = None
    packages: Set[PackageId] = None
    diagnosys: Set[DiagnosysId] = None
    state: ScanState = None
