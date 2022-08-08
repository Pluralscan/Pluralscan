from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.diagnosis.issues.issue import Issue
from pluralscan.domain.scans.scan_id import ScanId


@dataclass
class Diagnosis:
    """Diagnosis Aggregate Root."""

    scan_id: Optional[ScanId] = None
    created_at: datetime = field(default_factory=datetime.now)
    issues: List[Issue] = field(default_factory=list)
    report: Optional[DiagnosisReport] = None

    @classmethod
    def add_issue(cls, issue: Issue):
        """add_issue"""
        cls.issues.append(issue)

    def to_dict(self):
        return {
            "scan_id": repr(self.scan_id) if self.scan_id is not None else "",
            "created_at": self.created_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "issues": [issue.to_dict() for issue in self.issues],
            "report": asdict(self.report) if self.report is not None else "",
        }
