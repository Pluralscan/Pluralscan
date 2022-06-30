from dataclasses import dataclass, field
from typing import List

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.executables.executable_command import ExecutableCommand
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.executables.executable_platform import \
    ExecutablePlatform
from pluralscan.domain.executables.executable_runner import ExecutableRunner


@dataclass
class Executable:
    """Executable Entity."""
    executable_id: ExecutableId = None
    """Unique identifier."""
    analyzer_id: AnalyzerId = None
    """Analyzer identifier."""
    platform: ExecutablePlatform = None
    """Indicates the supported runtime environment."""
    name: str = None
    """Analyzer name."""
    location: str = None
    """Absolute path of the executable to run."""
    version: str = None
    """Unique version for the executable of an analyzer."""
    semantic_version: str = None
    """Semantic version (can be null)."""
    commands: List[ExecutableCommand] = field(default_factory=list)
    """Command that's can be performed by executable."""
    runner: ExecutableRunner = ExecutableRunner.GENERIC
    """Runner implementation type to use for run executable."""

    def add_command(self, command: ExecutableCommand):
        """add_command"""
        pass

    def get_command_by_action(self, action: ExecutableAction) -> ExecutableCommand:
        """get_command_by_action"""
        for command in self.commands:
            if command.action == action:
                return command
        return None

    def as_dict(self):
        """Convert executable properties to dictionary."""
        return {
            'platform': self.platform.value,
            'name': self.name,
            'location': self.location,
            'version': self.version,
            'semantic_version': self.semantic_version,
        }
