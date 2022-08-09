from dataclasses import dataclass
from pluralscan.domain.diagnosis.issues.issue_location import IssueLocation

from pluralscan.domain.diagnosis.issues.issue_severity import IssueSeverity
from pluralscan.domain.analyzers.rules.rule_id import RuleId


@dataclass(frozen=True)
class Issue:
    """Issue Value Object"""

    rule_id: RuleId
    message: str
    severity: IssueSeverity = IssueSeverity.UNKNOWN
    location: IssueLocation = IssueLocation()

    def to_dict(self):
        return {
            "rule_id": self.rule_id.code,
            "analyzer_id": str(self.rule_id.analyzer_id),
            "message": self.message,
            "severity": self.severity.name,
            "location": self.location.to_dict(),
        }