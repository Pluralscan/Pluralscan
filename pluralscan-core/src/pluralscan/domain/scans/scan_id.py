from dataclasses import dataclass


@dataclass(frozen=True, repr=False)
class ScanId():
    """An immutable Scan identifier."""
    identity: str

    def __str__(self) -> str:
        return self.identity

    def __repr__(self) -> str:
        return self.identity