from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from pluralscan.domain.common.metrics import ProjectLanguageMetric

from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class Project:
    """Project"""

    project_id: ProjectId #TODO: compose project_id with name and source
    name: str
    namespace: str
    source: ProjectSource
    last_snapshot: datetime
    uri: str
    language_metrics: List[ProjectLanguageMetric] = field(default_factory=list)
    description: str = field(default_factory=str)
    created_at: datetime = field(default_factory=datetime.now)
