from dataclasses import dataclass, field
from typing import List

from pluralscan.domain.technologies.language import Language


@dataclass
class Technology:
    """Technology"""
    name: str = None
    version: str = None
    language: Language = None
    extensions: List[str] = field(default_factory=list)
