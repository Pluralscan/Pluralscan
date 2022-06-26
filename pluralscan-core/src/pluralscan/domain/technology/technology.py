from dataclasses import dataclass

from pluralscan.domain.technology.language import Language


@dataclass(frozen=True)
class Technology:
    """Technology"""
    name: str = None
    version: str = None
    language: Language = None
