from dataclasses import dataclass
from typing import Optional

from pluralscan.domain.issues.issue_severity import IssueSeverity
from pluralscan.domain.rules.rule_id import RuleId


@dataclass(frozen=True)
class Issue:
    """Issue Value Object"""

    rule_id: RuleId
    message: str
    severity: Optional[IssueSeverity] = None
    is_suppresed: bool = False
    """Indicates that the rule is explicitly ignored inside the source."""
