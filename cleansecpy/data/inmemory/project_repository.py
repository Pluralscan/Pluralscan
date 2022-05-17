from tkinter import PROJECTING
from typing import Dict, List
import uuid
from cleansecpy.domain.project.project import Project

from cleansecpy.domain.project.project_repository import ProjectRepository


class InMemoryProjectRepository(ProjectRepository):
    def __init__(self):
        self.projects: Dict[str, PROJECTING] = {}

    def find_by_id(self, project_id: str) -> Project:
        return self.projects.get(project_id)

    def get_all(self) -> List[Project]:
        return list(self.projects.values())

    def update(self, project: Project) -> Project:
        project = self.find_by_id(project.id)
        
        if project == None:
            raise Exception

        self.projects[project.id] = project
        
        return project

    def add(self, project: Project) -> Project:
        str_uuid = str(uuid.uuid4())
        project.id = str_uuid
        
        self.projects[str_uuid] = project

        return project

    def remove(self, project_id: str):
        project = self.find_by_id(project_id)
        
        if project == None:
            raise Exception
        
        self.projects.pop(project_id)