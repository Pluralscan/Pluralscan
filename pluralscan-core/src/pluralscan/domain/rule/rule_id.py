from dataclasses import dataclass


@dataclass(frozen=True, init=False)
class RuleId:
    """An immutable rule identifier."""

    def __init__(self, code: str):
        self.code = code

    def __str__(self) -> str:
        return str(self.code)
