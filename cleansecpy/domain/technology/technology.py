from dataclasses import dataclass
from cleansecpy.domain.technology.language import Language


@dataclass(frozen=True)
class Technology:
    """Technology"""
    name: str = None
    version: str = None
    language: Language = None
