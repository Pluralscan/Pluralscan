from dataclasses import dataclass, field
from datetime import datetime

from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class Project:
    """Project"""

    project_id: ProjectId
    name: str
    source: ProjectSource
    uri: str
    last_snapshot: datetime
    description: str = field(default_factory=str)
    created_at: datetime = field(default_factory=datetime.now)
