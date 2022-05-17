from dataclasses import dataclass
from typing import Set

from cleansecpy.domain.technology.technology import Technology


@dataclass(frozen=True)
class TechnologySet:
    "Unique set of technologies."
    technologies: Set[Technology]

    def add_technology(self, technology: Technology):
        """add_technology"""
        self.technologies.add(technology)
        return self.technologies.copy()
