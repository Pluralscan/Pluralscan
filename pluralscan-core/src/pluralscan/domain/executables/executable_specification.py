from typing import List

from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.libs.ddd.specification import AbstractSpecification


class ExecutablesSpecification(AbstractSpecification):
    """ExecutablesSpecification"""

    def __init__(self, executables: List[ExecutableId]) -> None:
        self._executables = executables

    def is_satisfied_by(self, candidate: Executable) -> bool:
        return candidate.executable_id in self._executables
