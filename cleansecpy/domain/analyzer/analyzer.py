from dataclasses import dataclass, field
from typing import Set
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.technology.technology import Technology

from .analyzer_id import AnalyzerId
from .analyzer_target import AnalyzerTarget


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId = None
    name: str = None
    fullname: str = None
    version: str = None
    semantic_version: str = None
    supported_targets: Set[AnalyzerTarget] = field(default_factory=set)
    localization: str = 'en'
    """A tool object should contain a property named language whose value is a string specifying
    the language of the messages produced by the tool, in the format specified by RFC 3066."""

    executables: Set[Executable] = field(default_factory=set)
    technologies: Set[Technology] = field(default_factory=set)

    def get_executable_by_version(self, version: str) -> Executable | None:
        """get_executable_by_version"""
        for executable in self.executables:
            if executable.version is version:
                return executable
        return None

    def add_executable(self, executable: Executable):
        """add_executable"""
        self.executables.add(executable)
