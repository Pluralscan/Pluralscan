from dataclasses import dataclass
from typing import List

from pluralscan.domain.executables.executable_action import ExecutableAction


@dataclass(frozen=True, repr=False)
class ExecutableCommand:
    """Executable Command Value Object."""

    action: ExecutableAction
    arguments: List[str]

    def to_dict(self):
        """Convert executable command properties to dictionary."""
        return {
            "action": self.action.name,
            "arguments": self.arguments,
        }
