from dataclasses import dataclass, field
from typing import Any, Set

from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.shared.language import Language
from pluralscan.domain.analyzers.rules.rule_category import RuleCategory
from pluralscan.domain.analyzers.rules.rule_id import RuleId


@dataclass
class Rule:
    '''Rule'''
    rule_id: RuleId
    analyzer_id: AnalyzerId
    language: Language
    categories: Set[RuleCategory] = field(default_factory=set)
    description: str = field(default_factory=str)
    analog_rules: Set[RuleId] = field(default_factory=set)

    def add_analog_rule(self, rule: Any):
        """add_analog_rule"""
        if isinstance(rule, Rule):
            pass
        raise ValueError("Wrong type provided to rule.")
