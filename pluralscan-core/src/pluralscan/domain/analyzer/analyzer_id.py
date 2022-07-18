from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True, repr=True)
class AnalyzerId:
    """Analyzer identifier value object."""
    identity: Any

    def __str__(self) -> str:
        """Convert a AnalyzerId to a string."""
        return str(self.identity)

    def __repr__(self) -> str:
        return str(self.identity)
