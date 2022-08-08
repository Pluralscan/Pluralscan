from enum import Enum, unique


@unique
class ExecutablePlatform(Enum):
    """ExecutablePlatform"""
    INTERNAL = 'internal'
    WIN = 'win_exe'
    DOTNET = 'dotnet'
    CARGO = 'cargo'
    GOLANG = 'go'

    def __repr__(self) -> str:
        return self.value
