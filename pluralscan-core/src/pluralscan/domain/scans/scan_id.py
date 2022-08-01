from dataclasses import dataclass

from pluralscan.libs.ddd.value_object import ValueObject


@dataclass(frozen=True, repr=False)
class ScanId():
    """An immutable Scan identifier."""
    identity: str

    def __str__(self) -> str:
        return self.identity

    def __repr__(self) -> str:
        return self.identity