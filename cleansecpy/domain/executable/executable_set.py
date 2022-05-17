from dataclasses import dataclass
from typing import Set

from cleansecpy.domain.executable.executable_id import ExecutableId


@dataclass(frozen=True)
class ExecutableSet(Set[ExecutableId]):
    '''An immutable collection of rules.'''
