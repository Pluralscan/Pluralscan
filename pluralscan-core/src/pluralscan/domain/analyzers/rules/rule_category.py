from dataclasses import dataclass


@dataclass(frozen=True)
class RuleCategory:
    """RuleCategory"""
    short_name: str
    name: str
