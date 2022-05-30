from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List, Tuple

from cleansecpy.domain.executable.executable import Executable


@dataclass
class ProcessOptions():
    """ProcessOptions"""
    executable: Executable
    output_dir: str = None
    arguments: List[Tuple[str, str]] = None

@dataclass
class ProcessRunResult():
    """ProcessRunResult"""
    output_files: List[str]

class AbstractProcessRunner(metaclass=ABCMeta):
    """AbstractProcessRunner"""

    @abstractmethod
    def execute(self, options: ProcessOptions) -> None | Exception:
        """Execute a process without output result."""
        raise NotImplementedError

    @abstractmethod
    def execute_with_report(self, options: ProcessOptions) -> ProcessRunResult:
        """Execute a process and return raw report result."""
        raise NotImplementedError
