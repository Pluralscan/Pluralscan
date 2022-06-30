from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.rules.rule import Rule


class RuleRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for package persistence.
    """
    @abstractmethod
    def get_by_id(self, rule_id: str) -> Rule:
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Rule]:
        raise NotImplementedError()

    @abstractmethod
    def add(self, rule: Rule) -> Rule:
        raise NotImplementedError()

    @abstractmethod
    def update(self, rule: Rule) -> Rule:
        raise NotImplementedError()
