from dataclasses import dataclass, field
from typing import List

UNKNOWN_COMPILER = "unknown"
MSBUILD_COMPILER = "msbuild"
NODEJS_COMPILER = "nodejs"

@dataclass(frozen=True)
class Compiler:
    """Compiler"""

    name: str
    version: str
    extensions: List[str] = field(default_factory=list)
    config_files: List[str] = field(default_factory=list)

    @staticmethod
    def msbuild() -> "Compiler":
        """msbuild"""
        return Compiler(name=MSBUILD_COMPILER, version="*", extensions=['.sln', '.csproj'])

    @staticmethod
    def nodejs() -> "Compiler":
        """nodejs"""
        return Compiler(name=NODEJS_COMPILER, version="*", config_files=['package.json'])

    @staticmethod
    def compilers() -> List["Compiler"]:
        """Supported compilers"""
        return [
            Compiler.msbuild(),
            Compiler.nodejs()
        ]
