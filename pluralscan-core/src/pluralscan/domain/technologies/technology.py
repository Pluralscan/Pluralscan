from dataclasses import dataclass
from typing import List, Optional
from pluralscan.domain.common.language import CSHARP_LANGUAGE, JAVASCRIPT_LANGUAGE, Language

from pluralscan.domain.technologies.compiler import Compiler

DOTNET_TECHNOLOGY = "dotnet"
NODEJS_TECHNOLOGY = "nodejs"

@dataclass(frozen=True)
class Technology:
    """Technology"""

    code: str
    display_name: str
    languages: List[Language]
    compilers: List[Compiler]

    @staticmethod
    def dotnet() -> "Technology":
        """dotnet"""
        return Technology(code=DOTNET_TECHNOLOGY, display_name="Microsoft .NET", languages=[Language.csharp()], compilers=[Compiler.msbuild()])

    @staticmethod
    def nodejs() -> "Technology":
        """nodejs"""
        return Technology(code=NODEJS_TECHNOLOGY, display_name="NodeJS", languages=[Language.javascript()], compilers=[Compiler.nodejs()])

    @staticmethod
    def python() -> 'Technology':
        """python"""
        return Technology(code="", display_name='Python', languages=[], compilers=[])

    @staticmethod
    def technologies() -> List["Technology"]:
        """Supported technologies"""
        return [
            Technology.dotnet(),
            Technology.nodejs()
        ]

    @staticmethod
    def from_code(code: str) -> Optional['Technology']:
        """from_code"""
        if code in [DOTNET_TECHNOLOGY, CSHARP_LANGUAGE, 'C#']:
            return Technology.dotnet()
        if code in [NODEJS_TECHNOLOGY, JAVASCRIPT_LANGUAGE]:
            return Technology.nodejs()
        return None
