from dataclasses import dataclass, field
from typing import Any, Set

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.rule.rule_category import RuleCategory
from pluralscan.domain.rule.rule_id import RuleId
from pluralscan.domain.technology.language import Language


@dataclass
class Rule:
    '''Rule'''
    rule_id: RuleId
    analyzer_id: AnalyzerId
    language: Language = None
    categories: Set[RuleCategory] = field(default_factory=set)
    description: str = None
    analog_rules: Set[RuleId] = field(default_factory=set)

    def add_analog_rule(self, rule: Any):
        """add_analog_rule"""
        if isinstance(rule, Rule):
            pass
        raise ValueError("Wrong type provided to rule.")