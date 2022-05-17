from dataclasses import dataclass


@dataclass(frozen=True, init=False)
class ExecutableId:
    """An immutable Executable identifier."""

    def __init__(self, identity):
        self.identity = identity

    def __str__(self) -> str:
        return str(self.identity)
