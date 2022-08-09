from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import Optional
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.diagnosis.diagnosis import Diagnosis

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.domain.shared.scans.events.scan_scheduled_event import ScanScheduledEvent
from pluralscan.libs.ddd.aggregate_root import AbstractAggregateRoot
from pluralscan.libs.utils.dataclass import DataclassUtils


@dataclass
class Scan(AbstractAggregateRoot[ScanId]):
    """
    Scan Aggregate Root represent an analysis task to execute for a specific package.
    """

    package_id: PackageId
    """Package under analysis."""
    analyzer_id: AnalyzerId
    """Executable used for performs analysis."""
    executable_version: str
    working_directory: str # TODO: replace with StorageId
    diagnosis: Optional[Diagnosis] = None
    created_at: datetime = field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    state: ScanState = ScanState.SCHEDULED
    job_id: Optional[str] = None
    """If the scan is bulk scheduled, a batch identifier may exists."""

    def __post_init__(self):
        # TODO: validate business rules
        #self.aggregate_id = ScanId(str(uuid4()))
        if self.state is ScanState.SCHEDULED:
            self.add_domain_event(ScanScheduledEvent(self.uuid, self.to_dict()))


    def to_dict(self):
        """Transform entity class into parsable json dictionary."""

        diagnosis = (
            self.diagnosis.to_dict()
            if self.diagnosis is not None
            else ""
        )

        started_at = (
            self.started_at.strftime("%m/%d/%Y, %H:%M:%S")
            if self.started_at is not None
            else ""
        )

        ended_at = (
            self.ended_at.strftime("%m/%d/%Y, %H:%M:%S")
            if self.ended_at is not None
            else ""
        )

        return {
            "id": repr(self.uuid),
            "package_id": repr(self.package_id),
            "analyzer_id": repr(self.analyzer_id),
            "executable_version": self.executable_version,
            "diagnosis": diagnosis,
            "created_at": self.created_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "started_at": started_at,
            "ended_at": ended_at,
            "working_directory": self.working_directory,
            "state": self.state.value,
            "job_id": self.job_id or "",
        }
