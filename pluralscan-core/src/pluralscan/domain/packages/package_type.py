from enum import Enum, unique


@unique
class PackageType(Enum):
    """PackageType"""

    CONTAINER = "container"
    POETRY = "poetry"
    NPM = "npm"
    NUGET = "nuget"
    MAVEN = "maven"
