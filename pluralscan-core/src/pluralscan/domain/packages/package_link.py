from dataclasses import dataclass
from enum import Enum

class PackageLinkLabel(Enum):
    """PackageLinkLabel"""
    HOMEPAGE = "homepage"
    SOURCE_REPO = "source_repo"
    DOCUMENTATION = "documentation"
    ISSUE_TRACKER = "issue_tracker"


@dataclass(frozen=True)
class PackageLink:
    """PackageLink"""

    label: PackageLinkLabel
    url: str
