from dataclasses import dataclass, field
from typing import Set

from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.technology.technology import Technology

from .analyzer_id import AnalyzerId
from .analyzer_target import AnalyzerTarget


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId = None
    name: str = None
    description: str = None
    supported_targets: Set[AnalyzerTarget] = field(default_factory=set)
    localization: str = 'en'
    """A tool object should contain a property named language whose value is a string specifying
    the language of the messages produced by the tool, in the format specified by RFC 3066."""

    executables: Set[Executable] = field(default_factory=set)
    technologies: Set[Technology] = field(default_factory=set)

    def get_executable_by_version(self, version: str) -> Executable:
        """Retrieve a single executable with a specific version."""
        for executable in self.executables:
            if executable.version is version:
                return executable
        return None

    def add_executable(self, executable: Executable):
        """Provide a new executable to the analyzer."""
        self.executables.add(executable)