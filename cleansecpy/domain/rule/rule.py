from dataclasses import dataclass
from typing import Any

from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.rule.rule_category_collection import RuleCategoryCollection
from cleansecpy.domain.rule.rule_collection import RuleCollection
from cleansecpy.domain.rule.rule_id import RuleId


@dataclass
class Rule:
    '''Rule'''
    rule_id: RuleId
    analyzer_id: AnalyzerId
    categories: RuleCategoryCollection = RuleCategoryCollection()
    description: str = ""
    analog_rules: RuleCollection = RuleCollection()

    def add_analog_rule(self, rule: Any):
        """add_analog_rule"""
        if isinstance(rule, Rule):
            pass
        raise ValueError("Wrong type provided to rule.")
