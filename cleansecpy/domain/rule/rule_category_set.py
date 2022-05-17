from dataclasses import dataclass
from typing import Set
from cleansecpy.domain.rule.rule_category import RuleCategory


@dataclass(frozen=True)
class RuleCategorySet():
    """An immutable collection of rule categories."""
    categories: Set[RuleCategory]

    def add_category(self, category: RuleCategory):
        """add_category"""
        self.categories.add(category)
        return self.categories.copy()
