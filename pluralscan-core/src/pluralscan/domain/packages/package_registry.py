from enum import Enum, unique


@unique
class PackageRegistry(Enum):
    """PackageRegistry"""

    LOCAL = "local"
    CONTAINER = "container"
    POETRY = "poetry"
    NPM = "npm"
    NUGET = "nuget"
    MAVEN = "maven"
