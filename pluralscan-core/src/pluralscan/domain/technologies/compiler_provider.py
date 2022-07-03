from pluralscan.domain.technologies.compiler import COMPILERS, Compiler


class CompilerProvider:
    """CompilerProvider"""

    @staticmethod
    def get_by_code(code: str) -> Compiler:
        """get_by_code"""
        return COMPILERS[code]
