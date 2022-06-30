from dataclasses import dataclass
from typing import Dict, List, Optional


@dataclass(frozen=True)
class Compiler:
    """Compiler"""

    name: str
    version: str
    extensions: List[str]


MSBUILD_COMPILER = "msbuild"

COMPILERS: Dict[str, Compiler] = {
    MSBUILD_COMPILER: Compiler(
        name="msbuild",
        version="Community",
        extensions=[".csproj", ".vbproj", ".sln"],
    )
}

class CompilerProvider:
    """CompilerProvider"""

    @staticmethod
    def get_by_code(code: str) -> Optional[Compiler]:
        """get_by_code"""
        return COMPILERS.get(code)
