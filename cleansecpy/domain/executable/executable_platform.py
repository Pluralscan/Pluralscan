from enum import Enum, unique


@unique
class ExecutablePlatform(Enum):
    """ExecutablePlatform"""
    INTERNAL = 'internal'
    WIN = 'win_exe'
    DOTNET = 'dotnet'

    def __repr__(self) -> str:
        return self.value
