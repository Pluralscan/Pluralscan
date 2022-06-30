from enum import Enum, unique


@unique
class PackageOrigin(Enum):
    """PackageOrigin"""
    UNKNOWN = 'unknown'
    GIT = 'git'
    GITHUB = 'github'
    GITLAB = 'gitlab'
    LOCAL = 'local'
