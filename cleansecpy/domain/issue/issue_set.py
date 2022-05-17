from ast import Set
from dataclasses import dataclass

from cleansecpy.domain.issue.issue import Issue


@dataclass(frozen=True)
class IssueSet():
    "Set of unique issues."
    issues: Set[Issue] = []

    def add_issue(self, issue: Issue):
        pass