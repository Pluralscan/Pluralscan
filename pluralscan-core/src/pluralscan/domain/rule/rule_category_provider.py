from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.rule.rule_category import RuleCategory


class AbstractRuleCategoryProvider(metaclass=ABCMeta):
    """RuleCategoryProvider"""
    @abstractmethod
    def categories(self) -> List[RuleCategory]:
        """categories"""
        raise NotImplementedError()

class RuleCategoryProvider(AbstractRuleCategoryProvider):
    """RuleCategoryProvider"""

    def categories(self) -> List[RuleCategory]:
        """categories"""
        return [
            RuleCategory("DESI", "Design"),
            RuleCategory("NAME", "Naming"),
            RuleCategory("STYL", "Style"),
            RuleCategory("USGE", "Usage"),
            RuleCategory("PERF", "Performance"),
            RuleCategory("SECR", "Security"),
        ]
