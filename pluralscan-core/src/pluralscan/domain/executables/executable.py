from dataclasses import dataclass, field
from typing import List

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.executables.executable_command import ExecutableCommand
from pluralscan.domain.executables.executable_platform import ExecutablePlatform
from pluralscan.domain.executables.executable_runner import ExecutableRunner


@dataclass(frozen=True)
class Executable:
    """
    Executable Aggregate Root.
    """

    analyzer_id: AnalyzerId
    """Analyzer identifier."""
    platform: ExecutablePlatform
    """Indicates the supported runtime environment."""
    name: str = field(default_factory=str)
    """Analyzer name."""
    path: str = field(default_factory=str)
    """Absolute path of the executable to run."""
    version: str = field(default_factory=str)
    """Unique version for the executable of an analyzer."""
    semantic_version: str = field(default_factory=str)
    """Semantic version (can be null)."""
    commands: List[ExecutableCommand] = field(default_factory=list)
    """Command that's can be performed by executable."""
    runner: ExecutableRunner = ExecutableRunner.PROCESS
    """Runner implementation type to use for run executable."""

    def to_dict(self):
        """Convert executable value object to dictionary."""
        return {
            "analyzer_id": repr(self.analyzer_id),
            "platform": self.platform.name,
            "name": self.name,
            "path": self.path,
            "version": self.version,
            "semantic_version": self.semantic_version,
            "commands": [command.to_dict() for command in self.commands],
            "runner": self.runner.name,
        }

    def add_command(self, command: ExecutableCommand):
        """add_command"""
        pass

    def get_command_by_action(self, action: ExecutableAction) -> ExecutableCommand:
        """get_command_by_action"""
        for command in self.commands:
            if command.action == action:
                return command
        raise ValueError
