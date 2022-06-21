from dataclasses import dataclass

from pluralscan.domain.project.project_id import ProjectId

@dataclass
class Project:
    """Project"""
    project_id: ProjectId = None
    name: str = None
    description: str = None
    