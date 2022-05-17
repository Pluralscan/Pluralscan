from dataclasses import dataclass


@dataclass(frozen=True, init=False)
class AnalyzerId:
    """An immutable Analyzer identifier."""

    def __init__(self, identity):
        self.identity = identity

    def __str__(self) -> str:
        return str(self.identity)
