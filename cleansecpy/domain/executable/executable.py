from dataclasses import dataclass

from cleansecpy.domain.executable.executable_type import ExecutableType


@dataclass(frozen=True)
class Executable:
    """An immutable executable representation."""
    type: ExecutableType
    command: str
    options: str = None

    def as_dict(self):
        """Convert executable properties to dictionary."""
        return {
            'type': self.type.value,
            'commend': self.command,
            'options': self.options or ''
        }
