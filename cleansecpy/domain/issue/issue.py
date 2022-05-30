from dataclasses import dataclass
from cleansecpy.domain.issue.issue_location import IssueLocation
from cleansecpy.domain.issue.issue_severity import IssueSeverity
from cleansecpy.domain.rule.rule_id import RuleId


@dataclass(frozen=True)
class Issue():
    """Issue Value Object"""
    rule_id: RuleId = None
    severity: IssueSeverity = None
    message: str = None
    is_suppresed: bool = False
    """Indicates that the rule is explicitly ignored inside the source."""
    location: IssueLocation = None
