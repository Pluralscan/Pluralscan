from dataclasses import dataclass
from typing import Set
from cleansecpy.domain.rule.rule_id import RuleId


@dataclass(frozen=True)
class RuleCollection(Set[RuleId]):
    '''An immutable collection of rules.'''
