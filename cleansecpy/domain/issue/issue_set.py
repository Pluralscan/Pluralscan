from ast import Set
from dataclasses import dataclass

from cleansecpy.domain.issue.issue import Issue


@dataclass(frozen=True)
class IssueSet(Set[Issue]):
    "Set of unique issues."
