from dataclasses import dataclass

from cleansecpy.domain.project.project_id import ProjectId

@dataclass
class Project:
    """Project"""
    project_id: ProjectId = None
    name: str = ""
    description: str = ""
    