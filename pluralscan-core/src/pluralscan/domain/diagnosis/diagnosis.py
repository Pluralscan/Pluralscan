from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from pluralscan.domain.diagnosis.diagnosis_id import DiagnosisId
from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.issue.issue import Issue
from pluralscan.domain.scans.scan_id import ScanId


@dataclass
class Diagnosis:
    """Diagnosis entity."""

    diagnosis_id: DiagnosisId = None
    scan_id: ScanId = None
    created_on: datetime = field(default_factory=datetime.now)
    issues: List[Issue] = field(default_factory=list)
    report: DiagnosisReport = None

    @classmethod
    def add_issue(cls, issue: Issue):
        """add_issue"""
        cls.issues.append(issue)
