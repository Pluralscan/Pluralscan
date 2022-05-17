from dataclasses import dataclass
from cleansecpy.domain.issue.issue_location import IssueLocation
from cleansecpy.domain.issue.issue_severity import IssueSeverity
from cleansecpy.domain.rule.rule_id import RuleId


@dataclass
class Issue():
    """Infraction"""
    rule_id: RuleId
    severity: IssueSeverity
    is_suppresed: bool  # Explictly disabled insides source
    location: IssueLocation
