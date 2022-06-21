from enum import Enum, unique


@unique
class PackageOrigin(Enum):
    """PackageOrigin"""
    GIT = 'git'
    GITHUB = 'github'
    GITLAB = 'gitlab'
    LOCAL = 'local'
