from enum import Enum


class ExecutableRunner(Enum):
    """ExecutableRunner"""

    PROCESS = "Process"
    SONAR = "Sonar"
    ROSLYNATOR = "Roslynator"
    ROSLYN = "Roslyn"
    DEPENDENCY_CHECK = "Dependency Check"
    CLIPPY = "Clippy"
