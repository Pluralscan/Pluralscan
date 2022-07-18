from abc import ABCMeta, abstractmethod
from dataclasses import dataclass, field
from typing import Generic, List, Optional, TypeVar

from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_action import ExecutableAction
from pluralscan.domain.packages.package import Package


@dataclass(frozen=True)
class ExecRunnerOptions:
    """ProcessOptions"""

    executable: Executable
    package: Package
    action: ExecutableAction
    arguments: List[str] = field(default_factory=list)

    def __post_init__(self):
        if self.executable is None:
            raise ValueError("Executable must be defined.")

TOptions = TypeVar("TOptions", ExecRunnerOptions, None)


@dataclass(frozen=True)
class ProcessRunResult:
    """ProcessRunResult"""

    output: Optional[str] = None
    error: Optional[str] = None
    success: bool = error is None


class AbstractExecRunner(Generic[TOptions], metaclass=ABCMeta):
    """Contract that's define methods for execute external tools."""

    @abstractmethod
    def execute(self, options: TOptions) -> ProcessRunResult:
        """Execute a process without output result."""
        raise NotImplementedError

    @abstractmethod
    def execute_with_report(self, options: TOptions) -> ProcessRunResult:
        """Execute a process and return raw report result."""
        raise NotImplementedError


class AbstractExecRunnerFactory(metaclass=ABCMeta):
    """AbstractExecRunnerFactory"""

    @abstractmethod
    def create(self, executable: Executable, working_directory: str) -> AbstractExecRunner:
        """create"""
        raise NotImplementedError
