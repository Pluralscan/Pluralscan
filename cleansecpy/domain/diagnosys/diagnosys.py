from dataclasses import dataclass
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.issue.issue_set import IssueSet
from cleansecpy.domain.issue.issue_severity import IssueSeverity

from cleansecpy.domain.package.package_id import PackageId


@dataclass
class Diagnosys:
    """Diagnosys entity."""
    package_id: PackageId
    analyzer_id: AnalyzerId
    created_on: str = ""
    modified_on: str = ""
    issues: IssueSet = IssueSet()

    def get_issues_by_severity(self, severity: IssueSeverity):
        """get_issues_by_severity"""
        pass
