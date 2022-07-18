from enum import Enum, unique


@unique
class PackageSystem(Enum):
    """PackageSystem"""

    LOCAL = "local"
    DOCKER = "docker"
    PIP = "pip"
    NPM = "npm"
    YARN = "yarn"
    NUGET = "nuget"
    MAVEN = "maven"
