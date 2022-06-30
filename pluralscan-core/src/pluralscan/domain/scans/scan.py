from dataclasses import dataclass, field
from datetime import datetime

from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState


@dataclass
class Scan:
    """Scan Entity."""

    scan_id: ScanId = None
    executable_id: ExecutableId = None
    created_on: datetime = field(default_factory=datetime.now)
    started_on: datetime = None
    ended_on: datetime = None
    working_directory: str = None
    """Executables used to performs analysis."""
    package_id: PackageId = None
    """Package under analysis."""
    state: ScanState = ScanState.SCHEDULED
    group_id: str = None
