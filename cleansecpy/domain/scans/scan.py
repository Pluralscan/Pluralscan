from dataclasses import dataclass
from typing import Set
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.package.package_id import PackageId
from cleansecpy.domain.scans.scan_id import ScanId
from cleansecpy.domain.scans.scan_state import ScanState


@dataclass
class Scan:
    """Scan Aggregate."""

    scan_id: ScanId = None
    created_on: str = None
    modified_on: str = None
    analyzers: Set[AnalyzerId] = None
    packages: Set[PackageId] = None
    state: ScanState = None

    @classmethod
    def add_analyzer(cls, analyzer_id: AnalyzerId):
        """add_analyzer"""
        pass
