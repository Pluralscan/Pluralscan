from dataclasses import dataclass
from cleansecpy.domain.technology.language import Language


@dataclass(frozen=True)
class Technology:
    """Technology"""
    name: str
    version: str
    language: Language
