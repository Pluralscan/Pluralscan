from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from pluralscan.domain.common.metrics import ProjectLanguageMetric

from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class Project:
    """Project"""

    project_id: ProjectId  # TODO: compose project_id with namespace and source

    name: str

    namespace: str
    """
    Unique namespace project path for provided source (case insensitive).
    """

    source: ProjectSource
    """Where the project is stored (GITHUB, GITLAB, BITBUCKET...)."""

    last_snapshot: datetime
    """Last activity from the project."""

    homepage: str
    """
    A link to the homepage of the project (case insensitive).
    """

    language_metrics: List[ProjectLanguageMetric] = field(default_factory=list)
    description: str = field(default="No description available.")
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        self.namespace = self.namespace.lower()
        self.homepage = self.homepage.lower()

    def snapshot_relative_path(self) -> str:
        """
        Retrieve a relative storage path to the last snapshot of
        this project."""
        return f"{self.source.name}/{self.namespace.replace('.', '-')}/SNAPSHOT-{int(self.last_snapshot.timestamp()*1000).real}"

    def to_dict(self):
        """Transform Project object into dictonary representation."""
        return {
            "id": repr(self.project_id),
            "name": self.name,
            "namespace": self.namespace,
            "source": self.source.name,
            "last_snapshot": self.last_snapshot,
            "homepage": self.homepage,
            "description": self.description,
            "created_at": self.created_at,
            "language_metrics": self.language_metrics,
        }
