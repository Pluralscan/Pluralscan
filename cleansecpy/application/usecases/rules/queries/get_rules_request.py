
from dataclasses import dataclass


@dataclass(frozen=True)
class GetRulesRequest:
    """GetRulesRequest"""
    limit: int = 50
    offset: int = 0
