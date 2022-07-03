from typing import Dict, List

from pluralscan.domain.technologies.compiler import MSBUILD_COMPILER
from pluralscan.domain.technologies.compiler_provider import CompilerProvider
from pluralscan.domain.technologies.technology import Technology

UNKNOWN_TECHNOLOGY = "unknown"
CSHARP_TECHNOLOGY = "csharp"
VBSHARP_TECHNOLOGY = "vbsharp"
COBOL_TECHNOLOGY = "cobol"
JAVASCRIPT_TECHNOLOGY = "javascript"

TECHNOLOGIES: Dict[str, Technology] = {
    CSHARP_TECHNOLOGY: Technology(
        code="csharp",
        display_name="C#",
        source_extensions=[".cs"],
        compilers=[CompilerProvider.get_by_code(MSBUILD_COMPILER)],
    ),
    VBSHARP_TECHNOLOGY: Technology(
        code="vbsharp",
        display_name="VB#",
        source_extensions=[".vb"],
        compilers=[CompilerProvider.get_by_code(MSBUILD_COMPILER)],
    ),
    COBOL_TECHNOLOGY: Technology(
        code="cobol",
        display_name="Cobol",
        source_extensions=[".cbl"],
        compilers=[],
    ),
    JAVASCRIPT_TECHNOLOGY: Technology(
        code="js",
        display_name="Javascript",
        source_extensions=[".js"],
        compilers=[],
    ),
}

class TechnologyProvider:
    """TechnologyProvider"""

    @staticmethod
    def get_technologies() -> List[Technology]:
        """get_technologies"""
        technologies = TECHNOLOGIES.values()
        return list(technologies)

    @staticmethod
    def get_by_code(code: str) -> Technology:
        """Retrieve technology from an alias."""
        for lang in TECHNOLOGIES.values():
            code_condition = str(lang.code).lower() == code.lower()
            name_condition = str(lang.display_name).lower() == code.lower()
            if code_condition or name_condition:
                return lang
        raise ValueError()
