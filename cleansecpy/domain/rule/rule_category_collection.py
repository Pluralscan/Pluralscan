from dataclasses import dataclass
from typing import List
from cleansecpy.domain.rule.rule_category import RuleCategory

@dataclass(frozen=True)
class RuleCategoryCollection(List[RuleCategory]):
    """An immutable collection of rule categories."""