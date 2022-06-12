from enum import Enum, unique


@unique
class PackageType(Enum):
    """PackageType"""

    CSPROJ = "csproj"
    SLN = "sln"
    POETRY = "poetry"
    NPM = "npm"
    NUGET = "nuget"
    MAVEN = "maven"
