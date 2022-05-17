from dataclasses import dataclass
from typing import Set

from cleansecpy.domain.technology.technology import Technology


@dataclass
class TechnologySet(Set[Technology]):
    "Unique set of technologies."
