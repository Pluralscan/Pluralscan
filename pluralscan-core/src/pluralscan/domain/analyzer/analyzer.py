from dataclasses import dataclass, field
from typing import Set

from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.technologies.technology import Technology

from .analyzer_id import AnalyzerId


@dataclass
class Analyzer:
    """Analyzer Aggregate."""

    analyzer_id: AnalyzerId
    name: str = field(default_factory=str)
    description: str = field(default_factory=str)
    supported_language: Set[Technology] = field(default_factory=set)
    localization: str = 'en'
    executables: Set[Executable] = field(default_factory=set)
