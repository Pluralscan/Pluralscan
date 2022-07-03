import uuid
from typing import Dict, List, Optional

from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_repository import \
    AbstractProjectRepository
from pluralscan.domain.projects.project_source import ProjectSource


class InMemoryProjectRepository(AbstractProjectRepository):
    """InMemoryProjectRepository"""

    def __init__(self):
        self.projects: Dict[ProjectId, Project] = {}

    def next_id(self) -> ProjectId:
        return ProjectId(uuid.uuid4())

    def find_one(self, name: str, source: ProjectSource) -> Optional[Project]:
        for project in self.projects.values():
            if project.source is source and project.name == name:
                return project
        return None

    def get_by_id(self, project_id: ProjectId) -> Project:
        return self.projects[project_id]

    def get_all(self) -> List[Project]:
        return list(self.projects.values())

    def update(self, project: Project) -> Project:
        project = self.get_by_id(project.project_id)

        if project is None:
            raise Exception

        self.projects[project.project_id] = project

        return project

    def add(self, project: Project) -> Project:
        self.projects[project.project_id] = project
        return project

    def remove(self, project_id: ProjectId):
        project = self.get_by_id(project_id)

        if project is None:
            raise Exception

        self.projects.pop(project_id)
