from dataclasses import dataclass
from typing import Any, Set

from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.rule.rule_category_set import RuleCategorySet
from cleansecpy.domain.rule.rule_id import RuleId


@dataclass
class Rule:
    '''Rule'''
    rule_id: RuleId
    analyzer_id: AnalyzerId
    categories: RuleCategorySet = None
    description: str = ""
    analog_rules: Set[RuleId] = []

    def add_analog_rule(self, rule: Any):
        """add_analog_rule"""
        if isinstance(rule, Rule):
            pass
        raise ValueError("Wrong type provided to rule.")
