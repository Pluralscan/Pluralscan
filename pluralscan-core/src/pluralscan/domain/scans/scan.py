from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState


@dataclass
class Scan:
    """Scan Entity."""

    scan_id: ScanId
    package_id: PackageId
    """Package under analysis."""
    executable_id: ExecutableId
    """Executable used to performs analysis."""
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    working_directory: Optional[str] = None
    state: ScanState = ScanState.SCHEDULED
    batch: Optional[str] = None
    """If the scan is bulk scheduled, a batch identifier may exists."""
