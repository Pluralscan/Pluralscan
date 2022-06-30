from dataclasses import dataclass

from pluralscan.domain.technologies.language import Language


@dataclass(frozen=True)
class Source:
    """Source"""
    filename: str
    path: str
    language: Language
