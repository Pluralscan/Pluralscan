from dataclasses import dataclass
from typing import Set
from cleansecpy.domain.executable.executable import Executable



@dataclass(frozen=True)
class ExecutableSet(Set[Executable]):
    '''An immutable collection of rules.'''
