from enum import Enum, unique


@unique
class ExecutablePlatform(Enum):
    """ExecutablePlatform"""
    INTERNAL = 'internal'
    WIN = 'win_exe'
    DOTNET = 'dotnet'
