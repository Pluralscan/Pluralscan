from enum import Enum


class ExecutableRunner(Enum):
    """ExecutableRunner"""

    GENERIC = "Generic"
    SONAR = "Sonar"
    ROSLYNATOR = "Roslynator"
    ROSLYN = "Roslyn"
    DEPENDENCY_CHECK = "Dependency Check"
