from typing import List
from pluralscan.domain.project.project import Project

from pluralscan.domain.project.project_repository import AbstractProjectRepository


class MongoProjectRepository(AbstractProjectRepository):
    """MongoProjectRepository"""

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
