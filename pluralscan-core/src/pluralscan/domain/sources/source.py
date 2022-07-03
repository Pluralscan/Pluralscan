from dataclasses import dataclass

from pluralscan.domain.technologies.technology import Technology


@dataclass(frozen=True)
class Source:
    """Source"""
    filename: str
    path: str
    language: Technology
