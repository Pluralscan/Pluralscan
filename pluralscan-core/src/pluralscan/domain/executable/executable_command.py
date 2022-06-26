from dataclasses import dataclass
from typing import List

from pluralscan.domain.executable.executable_action import ExecutableAction


@dataclass(frozen=True, repr=False)
class ExecutableCommand:
    """Executable Command Value Object."""

    action: ExecutableAction
    arguments: List[str]
