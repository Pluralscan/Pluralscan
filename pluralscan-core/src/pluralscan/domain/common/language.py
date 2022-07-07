from dataclasses import dataclass
from typing import List

CSHARP_LANGUAGE = "csharp"
JAVASCRIPT_LANGUAGE = "javascript"


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
            code=CSHARP_LANGUAGE, display_name="C#", source_extensions=[".cs"]
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
    def unknown(code: str = "") -> "Language":
        """unknown"""
        return Language(code="Uknown", display_name=code, source_extensions=[])

    @staticmethod
    def from_code(code: str) -> "Language":
        """from_code"""
        if code in [CSHARP_LANGUAGE, "C#"]:
            return Language.csharp()
        return Language.unknown(code)
