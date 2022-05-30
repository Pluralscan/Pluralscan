from dataclasses import dataclass, field
from typing import Tuple

from cleansecpy.domain.executable.executable_type import ExecutableType


@dataclass(frozen=True)
class Executable:
    """Executable Value Object."""
    executable_type: ExecutableType = None
    name: str = None
    location: str = None
    version: str = None
    arguments: frozenset[Tuple[str, str]] = field(default_factory=frozenset)

    def as_dict(self):
        """Convert executable properties to dictionary."""
        return {
            'type': self.executable_type.value,
            'location': self.location,
        }
