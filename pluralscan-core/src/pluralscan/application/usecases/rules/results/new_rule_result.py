from dataclasses import dataclass

from pluralscan.domain.rule.rule import Rule


@dataclass
class NewRuleResult:
    """NewRuleResult"""
    rule: Rule
