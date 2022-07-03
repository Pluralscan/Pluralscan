from dataclasses import dataclass
from typing import List

from pluralscan.domain.technologies.compiler import Compiler


@dataclass(frozen=True)
class Technology:
    """Technology"""

    code: str
    display_name: str
    source_extensions: List[str]
    compilers: List[Compiler]
    