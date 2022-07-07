from dataclasses import dataclass
from enum import Enum
import re

GITHUB_SOURCE_PATTERN = (
    r"(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?"
)
GITLAB_SOURCE_PATTERN = (
    r"(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?"
)
GIT_SOURCE_PATTERN = r"[^/]+.git$"
LOCAL_SOURCE_PATTERN = r"[^/]+.zip$"


@dataclass(frozen=True)
class ProjectSource(Enum):
    """ProjectSource"""

    LOCAL = "local"
    GIT = "git"
    GITHUB = "github"
    GITLAB = "gitlab"
    BITBUCKET = "bitbucket"

    @staticmethod
    def from_uri(uri) -> "ProjectSource":
        """from_uri"""
        if re.search(GITHUB_SOURCE_PATTERN, uri):
            return ProjectSource.GITHUB

        if re.search(GITLAB_SOURCE_PATTERN, uri):
            return ProjectSource.GITLAB

        if re.search(LOCAL_SOURCE_PATTERN, uri):
            return ProjectSource.LOCAL

        if re.search(GIT_SOURCE_PATTERN, uri):
            return ProjectSource.GIT
        raise ValueError()

    @staticmethod
    def from_str(label):
        """from_str"""
        if label in ("github", "Github"):
            return ProjectSource.GITHUB
        elif label in ("gitlab", "Gitlab"):
            return ProjectSource.GITLAB
        elif label in ("local", "Local"):
            return ProjectSource.LOCAL
        else:
            raise NotImplementedError
