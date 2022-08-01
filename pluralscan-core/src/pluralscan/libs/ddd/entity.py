from abc import ABCMeta
from pluralscan.libs.ddd.exceptions import BusinessRuleException

from pluralscan.libs.ddd.rule import AbstractBusinessRule


class AbstractEntity(metaclass=ABCMeta):
    """AbstractEntity"""

    def check_rule(self, rule: AbstractBusinessRule):
        """
        Ensure that the current state of entity
        respect a specific business rule.
        """
        if rule.is_broken():
            raise BusinessRuleException(rule)
