from dataclasses import dataclass
from enum import Enum
from typing import List


@dataclass
class Language(Enum):
    """Language"""

    UNKNOWN = ("unknown", "Unknown", [])
    COBOL = ("cobol", "Cobol", ["cbl"])
    CSHARP = ("csharp", "C#", [".cs"])
    VBSHARP = ("vbsharp", "VB#", [".vb"])
    JAVASCRIPT = ('javascript', "JS", [".js"])
    HTML = ('html', 'HTML', ['.html'])

    def __new__(cls, code: str, alias: str, extensions: List[str]):
        entry = object.__new__(cls)
        entry._value_ = code
        entry.alias = alias
        entry.extensions = extensions
        return entry

    @classmethod
    def _missing_(cls, value):
        """
        Fallback method when provided value is not found, try case insensitive
        alternative or alias comparaison.
        """
        for member in cls:
            insensitive_condition = str(member.value).lower() == str(value).lower()
            alias_condition = str(member.alias).lower() == str(value).lower()
            if insensitive_condition or alias_condition:
                return member
        return None

    @staticmethod
    def from_alias(_alias):
        """Retrieve language from an alias."""
        for lang in Language:
            if lang.alias == _alias:
                return lang
        raise ValueError()
