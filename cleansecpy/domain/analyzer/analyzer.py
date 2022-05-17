from dataclasses import dataclass

from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.executable.executable_set import ExecutableSet
from cleansecpy.domain.technology.technology_set import TechnologySet


@dataclass
class Analyzer:
    """Analyzer entity."""
    analyzer_id: AnalyzerId
    name: str
    version: str
    executables: ExecutableSet = None
    technologies: TechnologySet = None
