from dataclasses import dataclass, field
from typing import List, Optional
from pluralscan.domain.shared.compiler import Compiler
from pluralscan.domain.shared.language import (
    CSHARP_LANGUAGE,
    GO_LANGUAGE,
    JAVA_LANGUAGE,
    RUST_LANGUAGE,
    Language,
)


DOTNET_TECHNOLOGY = "dotnet"
NODEJS_TECHNOLOGY = "nodejs"
JAVA_TECHNOLOGY = "java"
PYTHON_TECHNOLOGY = "python"
GOLANG_TECHNOLOGY = "go"
RUST_TECHNOLOGY = "rust"


@dataclass(frozen=True)
class Technology:
    """Technology"""

    code: str
    display_name: str
    languages: List[Language] = field(default_factory=list)
    compilers: List[Compiler] = field(default_factory=list)
    manifests: List[str] = field(default_factory=list)

    @staticmethod
    def unknown() -> "Technology":
        """unknown"""
        return Technology(code="Unknown", display_name="Unknown")

    @staticmethod
    def dotnet() -> "Technology":
        """dotnet"""
        return Technology(
            code=DOTNET_TECHNOLOGY,
            display_name="Microsoft .NET",
            languages=[Language.csharp()],
            compilers=[Compiler.msbuild()],
        )

    @staticmethod
    def java() -> "Technology":
        """java"""
        return Technology(
            code=JAVA_TECHNOLOGY,
            display_name="Java",
            languages=[Language.java()],
        )

    @staticmethod
    def golang() -> "Technology":
        """golang"""
        return Technology(
            code=GOLANG_TECHNOLOGY,
            display_name="Go",
            languages=[Language.golang()],
        )

    @staticmethod
    def nodejs() -> "Technology":
        """nodejs"""
        return Technology(
            code=NODEJS_TECHNOLOGY,
            display_name="Node.js",
            languages=[Language.javascript()],
            compilers=[Compiler.nodejs()],
        )

    @staticmethod
    def python() -> "Technology":
        """python"""
        return Technology(
            code=PYTHON_TECHNOLOGY, display_name="Python", languages=[Language.python()]
        )

    @staticmethod
    def rust() -> "Technology":
        """Rust"""
        return Technology(
            code=RUST_TECHNOLOGY, display_name="Rust", languages=[Language.rust()]
        )

    @staticmethod
    def technologies() -> List["Technology"]:
        """Supported technologies"""
        return [Technology.dotnet(), Technology.nodejs()]

    @staticmethod
    def from_code(code: str) -> "Technology":
        """from_code"""
        if code in [DOTNET_TECHNOLOGY, CSHARP_LANGUAGE, "C#"]:
            return Technology.dotnet()
        if code in [NODEJS_TECHNOLOGY]:
            return Technology.nodejs()
        if code in [JAVA_TECHNOLOGY, JAVA_LANGUAGE]:
            return Technology.java()
        if code in [GOLANG_TECHNOLOGY, GO_LANGUAGE]:
            return Technology.golang()
        if code in [RUST_TECHNOLOGY, RUST_LANGUAGE]:
            return Technology.rust()

        return Technology.unknown()
