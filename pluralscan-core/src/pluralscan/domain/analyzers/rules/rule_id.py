from dataclasses import dataclass
from typing import Optional

from pluralscan.domain.analyzers.analyzer_id import AnalyzerId


@dataclass(frozen=True)
class RuleId:
    """An immutable rule identifier."""
    code: str
    analyzer_id: Optional[AnalyzerId] = None

    def __str__(self) -> str:
        return str(self.code)
