from dataclasses import dataclass

from pluralscan.domain.rules.rule import Rule


@dataclass
class NewRuleResult:
    """NewRuleResult"""
    rule: Rule
