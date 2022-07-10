from enum import Enum, unique


@unique
class PackageRegistry(Enum):
    """PackageRegistry"""

    LOCAL = "local"

    DOCKER = "docker"

    PYPI = "pypi"
    """
    The Python Package Index (PyPI) is a repository of software for the Python programming language.
    https://pypi.org/
    """

    NPM = "npm"
    NUGET = "nuget"
    MAVEN = "maven"
