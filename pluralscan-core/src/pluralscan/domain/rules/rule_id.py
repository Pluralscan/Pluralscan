from dataclasses import dataclass, field
from typing import Optional

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId


@dataclass(frozen=True)
class RuleId:
    """An immutable rule identifier."""
    code: str
    analyzer_id: Optional[AnalyzerId] = field(default_factory=None)

    def __str__(self) -> str:
        return str(self.code)
