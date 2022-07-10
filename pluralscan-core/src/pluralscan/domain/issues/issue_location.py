from dataclasses import dataclass
from enum import Enum


class IssueLocationKind(Enum):
    """IssueLocationKind"""

    UNKNOWN = 0
    SOURCE = 1
    METADATA = 2


@dataclass(frozen=True)
class IssueLocation:
    """IssueLocation"""

    path: str = None
    absolute_path: str = None
    line: int = 0
    column: int = 0
    end_line: int = 0
    end_column: int = 0
    kind: IssueLocationKind = IssueLocationKind.UNKNOWN
