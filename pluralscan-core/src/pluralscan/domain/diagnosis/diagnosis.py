from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.diagnosis.issues.issue import Issue
from pluralscan.domain.scans.scan_id import ScanId


@dataclass
class Diagnosis:
    """Diagnosis Entity."""

    scan_id: Optional[ScanId] = None
    created_at: datetime = field(default_factory=datetime.now)
    issues: List[Issue] = field(default_factory=list)
    report: Optional[DiagnosisReport] = None

    @classmethod
    def add_issue(cls, issue: Issue):
        """add_issue"""
        cls.issues.append(issue)
