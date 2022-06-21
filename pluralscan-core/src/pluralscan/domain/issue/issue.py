from dataclasses import dataclass
from pluralscan.domain.issue.issue_location import IssueLocation
from pluralscan.domain.issue.issue_severity import IssueSeverity
from pluralscan.domain.rule.rule_id import RuleId


@dataclass(frozen=True)
class Issue():
    """Issue Value Object"""
    rule_id: RuleId = None
    severity: IssueSeverity = None
    message: str = None
    is_suppresed: bool = False
    """Indicates that the rule is explicitly ignored inside the source."""
    location: IssueLocation = None
