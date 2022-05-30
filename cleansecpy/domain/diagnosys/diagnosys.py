from dataclasses import dataclass
from typing import List, Set
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.diagnosys.diagnosys_id import DiagnosysId
from cleansecpy.domain.diagnosys.diagnosys_report import DiagnosysReport
from cleansecpy.domain.issue.issue import Issue
from cleansecpy.domain.package.package_id import PackageId


@dataclass
class Diagnosys:
    """Diagnosys entity."""

    diagnosys_id: DiagnosysId = None
    package_id: PackageId = None
    analyzer_id: AnalyzerId = None
    created_on: str = None
    modified_on: str = None
    issues: Set[Issue] = None
    report: DiagnosysReport = None

    @classmethod
    def add_issue(cls, issue: Issue):
        """add_issue"""
        cls.issues.add(issue)
