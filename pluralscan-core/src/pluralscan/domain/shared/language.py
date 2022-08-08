from dataclasses import dataclass
from typing import List

CSHARP_LANGUAGE = "csharp"
JAVASCRIPT_LANGUAGE = "javascript"
JAVA_LANGUAGE = "java"
PYTHON_LANGUAGE = "python"
TYPESCRIPT_LANGUAGE = "typescript"
GO_LANGUAGE = "go"
RUST_LANGUAGE = "rust"

@dataclass(frozen=True)
class Language:
    """Language"""

    code: str
    display_name: str
    source_extensions: List[str]

    @staticmethod
    def csharp() -> "Language":
        """csharp"""
        return Language(
            code=CSHARP_LANGUAGE,
            display_name="C#",
            source_extensions=[".cs"],
        )

    @staticmethod
    def java() -> "Language":
        """java"""
        return Language(
            code=JAVA_LANGUAGE,
            display_name="Java",
            source_extensions=[".java"],
        )

    @staticmethod
    def python() -> "Language":
        """python"""
        return Language(
            code=PYTHON_LANGUAGE, display_name="Python", source_extensions=[".py"]
        )

    @staticmethod
    def javascript() -> "Language":
        """javascript"""
        return Language(
            code=JAVASCRIPT_LANGUAGE,
            display_name="JavaScript",
            source_extensions=[".js"],
        )

    @staticmethod
    def typescript() -> "Language":
        """typescript"""
        return Language(
            code=TYPESCRIPT_LANGUAGE,
            display_name="TypeScript",
            source_extensions=[".ts"],
        )

    @staticmethod
    def golang() -> "Language":
        """golang"""
        return Language(
            code=GO_LANGUAGE,
            display_name="Go",
            source_extensions=[".go"],
        )

    @staticmethod
    def rust() -> "Language":
        """rust"""
        return Language(
            code=RUST_LANGUAGE,
            display_name="Rust",
            source_extensions=[".rs"],
        )

    @staticmethod
    def unknown(code: str = "") -> "Language":
        """unknown"""
        return Language(code="Unknown", display_name=code, source_extensions=[])

    @staticmethod
    def from_code(code: str) -> "Language":
        """from_code"""
        if code in [CSHARP_LANGUAGE, 'C#']:
            return Language.csharp()
        if code in [GO_LANGUAGE, 'Go']:
            return Language.golang()
        if code in [JAVA_LANGUAGE]:
            return Language.java()
        if code in [JAVASCRIPT_LANGUAGE]:
            return Language.javascript()
        if code in [TYPESCRIPT_LANGUAGE]:
            return Language.typescript()
        if code in [PYTHON_LANGUAGE]:
            return Language.python()
        if code in [RUST_LANGUAGE]:
            return Language.rust()
        return Language.unknown(code)
