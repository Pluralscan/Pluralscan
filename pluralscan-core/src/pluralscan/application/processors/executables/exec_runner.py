from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, field
from typing import List

from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.executable.executable_action import ExecutableAction


@dataclass
class ExecRunnerOptions:
    """ProcessOptions"""

    executable: Executable
    action: ExecutableAction
    arguments: List[str] = field(default_factory=list)

    def __post_init__(self):
        if self.executable is None:
            raise ValueError("Executable must be defined.")


@dataclass
class ProcessRunResult:
    """ProcessRunResult"""

    output: str = None
    success: bool = True


class AbstractExecRunner(metaclass=ABCMeta):
    """Contract that's define methods for execute external tools."""

    @abstractmethod
    def execute(self, options: ExecRunnerOptions) -> None:
        """Execute a process without output result."""
        raise NotImplementedError

    @abstractmethod
    def execute_with_report(self, options: ExecRunnerOptions) -> ProcessRunResult:
        """Execute a process and return raw report result."""
        raise NotImplementedError


class AbstractExecRunnerFactory(metaclass=ABCMeta):
    """AbstractExecRunnerFactory"""

    @abstractmethod
    def create(self, executable: Executable, working_directory: str) -> AbstractExecRunner:
        """create"""
        raise NotImplementedError
