from dataclasses import dataclass
from typing import List

from cleansecpy.domain.project.project_id import ProjectId

@dataclass
class Project:
    id: ProjectId = None
    name: str = ""