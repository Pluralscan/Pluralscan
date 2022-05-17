from typing import Dict, List
from cleansecpy.domain.project.project import Project

from cleansecpy.domain.project.project_repository import ProjectRepository

class MongoProjectRepository(ProjectRepository):
    def __init__(self):
        pass

    def find_by_id(self, project_id: str) -> Project:
        pass

    def get_all(self) -> List[Project]:
        pass

    def update(self, project: Project) -> Project:
        pass

    def add(self, project: Project) -> Project:
        pass

    def remove(self, project_id: str):
        pass