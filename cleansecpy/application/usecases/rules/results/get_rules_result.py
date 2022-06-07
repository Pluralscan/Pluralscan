from dataclasses import dataclass
from typing import List

from cleansecpy.domain.rule.rule import Rule


@dataclass
class GetRulesResult:
    """GetRulesResult"""
    rules: List[Rule]
