from dataclasses import dataclass, field
from typing import Tuple

from cleansecpy.domain.executable.executable_platform import ExecutablePlatform


@dataclass(frozen=True)
class Executable:
    """Executable Value Object."""
    platform: ExecutablePlatform = None
    name: str = None
    location: str = None
    version: str = None
    semantic_version: str = None
    arguments: frozenset[Tuple[str, str]] = field(default_factory=frozenset)

    def as_dict(self):
        """Convert executable properties to dictionary."""
        return {
            'platform': self.platform.value,
            'name': self.name,
            'location': self.location,
            'version': self.version,
            'semantic_version': self.semantic_version,
            'arguments': self.arguments
        }
