from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class Compiler:
    """Compiler"""

    name: str
    version: str
    extensions: List[str]

UNKNOWN_COMPILER = "unknown"
MSBUILD_COMPILER = "msbuild"

COMPILERS: Dict[str, Compiler] = {
    MSBUILD_COMPILER: Compiler(
        name="msbuild",
        version="Community",
        extensions=[".csproj", ".vbproj", ".sln"],
    )
}
