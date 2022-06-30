from dataclasses import dataclass
from typing import Dict, List, Set

from pluralscan.domain.technologies.compiler import (MSBUILD_COMPILER,
                                                     Compiler,
                                                     CompilerProvider)


@dataclass(frozen=True)
class Language:
    """Language"""

    code: str
    display_name: str
    source_extensions: Set[str]
    compilers: Set[Compiler]


CSHARP = "csharp"
VBSHARP = "vbsharp"
COBOL = "cobol"
JAVASCRIPT = "js"

LANGUAGES: Dict[str, Language] = {
    CSHARP: Language(
        code="csharp",
        display_name="C#",
        source_extensions=[".cs"],
        compilers=[CompilerProvider.get_by_code(MSBUILD_COMPILER)],
    ),
    VBSHARP: Language(
        code="vbsharp",
        display_name="VB#",
        source_extensions=[".vb"],
        compilers=[CompilerProvider.get_by_code(MSBUILD_COMPILER)],
    ),
    COBOL: Language(
        code="cobol",
        display_name="Cobol",
        source_extensions=[".cbl"],
        compilers=[],
    ),
    JAVASCRIPT: Language(
        code="js",
        display_name="Javascript",
        source_extensions=[".js"],
        compilers=[],
    ),
}


class LanguageProvider:
    """LanguageProvider"""

    @staticmethod
    def get_languages() -> List[Language]:
        """get_languages"""
        return LANGUAGES.values()

    @staticmethod
    def get_by_code(code: str) -> Language:
        """Retrieve language from an alias."""
        for lang in LANGUAGES.values():
            code_condition = str(lang.code).lower() == code.lower()
            name_condition = str(lang.display_name).lower() == code.lower()
            if code_condition or name_condition:
                return lang
        raise ValueError()
