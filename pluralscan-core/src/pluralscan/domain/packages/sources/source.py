from dataclasses import dataclass

from pluralscan.domain.shared.language import Language



@dataclass(frozen=True)
class Source:
    """Source"""
    filename: str
    path: str
    language: Language
