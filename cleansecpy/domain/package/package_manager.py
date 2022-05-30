from enum import Enum, unique


@unique
class PackageManager(Enum):
    """Package Manager used for sources project."""
    MAVEN = 'maven',
    GRADLE = 'gradle',
    NUGET = 'nuget'
