from dataclasses import dataclass

from cleansecpy.domain.rule.rule import Rule


@dataclass
class NewRuleResult:
    """NewRuleResult"""
    rule: Rule
