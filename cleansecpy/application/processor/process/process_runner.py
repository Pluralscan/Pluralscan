from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List

from cleansecpy.domain.executable.executable import Executable


@dataclass
class ProcessOptions():
    """ProcessOptions"""
    executable: Executable
    arguments: List[str] = []


class AbstractProcessRunner(metaclass=ABCMeta):
    """AbstractProcessRunner"""

    @abstractmethod
    def execute(self, options: ProcessOptions) -> None | Exception:
        """Execute a process without output result."""
        raise NotImplementedError

    @abstractmethod
    def execute_with_output(self, options: ProcessOptions):
        """Execute a process and redirect output."""
        raise NotImplementedError
