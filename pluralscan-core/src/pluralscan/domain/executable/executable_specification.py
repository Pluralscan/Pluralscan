from typing import List

from pluralscan.domain.executable.executable import Executable
from pluralscan.libs.ddd.specification import AbstractSpecification


class ExecutablesSpecification(AbstractSpecification):
    """ExecutablesSpecification"""

    def __init__(self, executables: List[str]) -> None:
        self._executables = executables

    def is_satisfied_by(self, candidate: Executable) -> bool:
        return candidate.executable_id in self._executables
