from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, repr=False)
class PackageId:
    """A package ID."""

    identity: Any

    def __str__(self) -> str:
        return str(self.identity)

    def __repr__(self) -> str:
        return str(self.identity)
