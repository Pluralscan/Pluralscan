from dataclasses import dataclass
from enum import Enum

class PackageLinkLabel(Enum):
    """PackageLinkLabel"""
    HOMEPAGE = "Homepage"
    SOURCE_REPO = "SourceRepository"
    DOCUMENTATION = "Documentation"
    ISSUE_TRACKER = "IssueTracker"


@dataclass(frozen=True)
class PackageLink:
    """PackageLink"""

    label: PackageLinkLabel
    url: str
