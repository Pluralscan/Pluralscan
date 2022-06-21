from dataclasses import dataclass
from typing import List

from pluralscan.domain.rule.rule import Rule


@dataclass
class GetRulesResult:
    """GetRulesResult"""
    rules: List[Rule]
