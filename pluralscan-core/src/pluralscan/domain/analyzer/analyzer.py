from dataclasses import dataclass, field
from typing import List, Set

from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.technologies.technology import Technology

from .analyzer_id import AnalyzerId


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId
    name: str
    technologies: Set[Technology]
    """Indicates the technologies handled by the analyzer."""
    description: str = field(default_factory=str)
    localization: str = 'en'
    executables: List[Executable] = field(default_factory=list)

    def add_executable(self, executable: Executable):
        """add_executables"""
        self.executables.append(executable)

    def add_executables(self, executables: List[Executable]):
        """add_executables"""
        for executable in executables:
            self.add_executable(executable)
