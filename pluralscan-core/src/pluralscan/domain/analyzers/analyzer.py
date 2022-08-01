from dataclasses import dataclass, field
from typing import List, Optional, Set

from pluralscan.domain.analyzers.executables.executable import Executable
from pluralscan.domain.shared.technology import Technology

from .analyzer_id import AnalyzerId


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId
    name: str
    technologies: Set[Technology]
    """Indicates the technologies handled by the analyzer."""
    description: str = field(default_factory=str)
    executables: List[Executable] = field(default_factory=list)

    def to_dict(self):
        """Transform Project object into dictonary representation."""
        return {
            "id": repr(self.analyzer_id),
            "name": self.name,
            "technologies": self.technologies,
            "description": self.description,
            "executables": [executable.to_dict() for executable in self.executables],
        }

    def add_executable(self, executable: Executable):
        """add_executables"""
        self.executables.append(executable)

    def add_executables(self, executables: List[Executable]):
        """add_executables"""
        for executable in executables:
            self.add_executable(executable)

    def find_executables_by_version(self, versions: List[str]) -> List[Executable]:
        """find_executables_by_version"""
        return [x for x in self.executables if x.version in versions]

    def find_executable_by_version(self, version: str) -> Optional[Executable]:
        """find_executable_by_version"""
        for executable in self.executables:
            if executable.version == version:
                return executable
        return None
