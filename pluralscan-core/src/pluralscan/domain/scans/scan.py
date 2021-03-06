from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Optional
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.diagnosis.diagnosis import Diagnosis

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState


@dataclass
class Scan:
    """
    A scan represent an analysis task to execute for a specific package.
    """

    scan_id: ScanId
    package_id: PackageId
    """Package under analysis."""
    analyzer_id: AnalyzerId
    """Executable used for performs analysis."""
    executable_version: str
    diagnosis: Optional[Diagnosis] = None
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    working_directory: Optional[str] = None
    state: ScanState = ScanState.SCHEDULED
    batch: Optional[str] = None
    """If the scan is bulk scheduled, a batch identifier may exists."""

    def to_dict(self):
        """Transform entity object into dictonary representation."""
        return {
            "id": repr(self.scan_id),
            "package_id": repr(self.package_id),
            "analyzer_id": repr(self.analyzer_id),
            "executable_version": self.executable_version,
            "diagnosis": asdict(self.diagnosis),
            "created_at": self.created_at,
            "started_at": self.started_at,
            "ended_at": self.ended_at,
            "working_directory": self.working_directory,
            "state": self.state.name,
            "batch": self.batch,
        }