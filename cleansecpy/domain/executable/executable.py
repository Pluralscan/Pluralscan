from dataclasses import dataclass
from cleansecpy.domain.executable.executable_id import ExecutableId

from cleansecpy.domain.executable.executable_type import ExecutableType


@dataclass(frozen=True)
class Executable:
    """An immutable executable representation."""
    executable_id: ExecutableId
    type: ExecutableType
    command: str
    options: str = None

    def as_dict(self):
        """Convert executable properties to dictionary."""
        return {
            'executable_id': self.executable_id,
            'type': self.type.value,
            'commend': self.command,
            'options': self.options or ''
        }
