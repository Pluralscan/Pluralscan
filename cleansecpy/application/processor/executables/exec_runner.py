from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List, Tuple

from cleansecpy.domain.executable.executable import Executable


@dataclass
class ExecRunnerOptions:
    """ProcessOptions"""

    executable: Executable
    arguments: List[Tuple[str, str]] = None


@dataclass
class ProcessRunResult:
    """ProcessRunResult"""

    output: str = None
    success: bool = True


class AbstractExecRunner(metaclass=ABCMeta):
    """Contract that's define methods for execute external tools."""

    @abstractmethod
    def execute(self, options: ExecRunnerOptions) -> None | Exception:
        """Execute a process without output result."""
        raise NotImplementedError

    @abstractmethod
    def execute_with_report(self, options: ExecRunnerOptions) -> ProcessRunResult:
        """Execute a process and return raw report result."""
        raise NotImplementedError
