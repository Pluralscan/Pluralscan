from dataclasses import dataclass, field
from typing import Set

from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.technologies.language import Language
from pluralscan.domain.technologies.technology import Technology

from .analyzer_id import AnalyzerId


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId = None
    name: str = None
    description: str = None
    supported_language: Set[Language] = field(default_factory=set)
    localization: str = 'en'
    executables: Set[Executable] = field(default_factory=set)

    def get_executable_by_version(self, version: str) -> Executable:
        """Retrieve a single executable with a specific version."""
        for executable in self.executables:
            if executable.version is version:
                return executable
        return None

    def add_executable(self, executable: Executable):
        """Provide a new executable to the analyzer."""
        self.executables.add(executable)
