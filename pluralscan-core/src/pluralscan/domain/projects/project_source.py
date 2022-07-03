from dataclasses import dataclass
from enum import Enum
import re

GITHUB_SOURCE_PATTERN = r"(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?"
GITLAB_SOURCE_PATTERN = r"(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?"
GIT_SOURCE_PATTERN = r"[^/]+.git$"
LOCAL_SOURCE_PATTERN = r"[^/]+.zip$"

@dataclass(frozen=True)
class ProjectSource(Enum):
    """ProjectSource"""

    LOCAL = 'local'
    GIT = 'git'
    GITHUB = 'github'
    GITLAB = 'gitlab'
    BITBUCKET = 'bitbucket'

    @staticmethod
    def detect_source(uri) -> 'ProjectSource':
        """detect_source"""
        if re.search(GITHUB_SOURCE_PATTERN, uri):
            return ProjectSource.GITHUB

        if re.search(GITLAB_SOURCE_PATTERN, uri):
            return ProjectSource.GITLAB

        if re.search(LOCAL_SOURCE_PATTERN, uri):
            return ProjectSource.LOCAL

        if re.search(GIT_SOURCE_PATTERN, uri):
            return ProjectSource.GIT
        raise ValueError()
