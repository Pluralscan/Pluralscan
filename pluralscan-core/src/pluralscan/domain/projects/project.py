from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from pluralscan.domain.common.metrics import ProjectLanguageMetric

from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class Project:
    """Project"""

    project_id: ProjectId  # TODO: compose project_id with name and source
    name: str
    namespace: str
    source: ProjectSource
    """Where the project is stored (GITHUB, GITLAB, BITBUCKET...)."""
    last_snapshot: datetime
    """Last activity from the project."""
    homepage: str
    """A link to the homepage of the project."""
    language_metrics: List[ProjectLanguageMetric] = field(default_factory=list)
    description: str = field(default_factory=str)
    created_at: datetime = field(default_factory=datetime.now)

    def snapshot_relative_path(self) -> str:
        """
        Retrieve a relative storage path to the last snapshot of
        this project."""
        return f"{self.source.name}/{self.namespace.replace('.', '-')}/SNAPSHOT-{int(self.last_snapshot.timestamp()*1000).real}"
