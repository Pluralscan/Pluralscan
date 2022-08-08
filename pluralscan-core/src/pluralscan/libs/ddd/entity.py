from abc import ABCMeta
from dataclasses import dataclass
from typing import Generic, TypeVar
from pluralscan.libs.ddd.exceptions import BusinessRuleException

from pluralscan.libs.ddd.rule import AbstractBusinessRule

TKey = TypeVar("TKey")

@dataclass
class AbstractEntity(Generic[TKey], metaclass=ABCMeta):
    """AbstractEntity"""

    uuid: TKey

    def check_rule(self, rule: AbstractBusinessRule):
        """
        Ensure that the current state of entity
        respect a specific business rule.
        """
        if rule.is_broken():
            raise BusinessRuleException(rule)
