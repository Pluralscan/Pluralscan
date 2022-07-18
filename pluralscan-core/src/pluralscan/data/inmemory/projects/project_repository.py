from math import ceil
import uuid
from typing import Dict, Optional

from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_repository import AbstractProjectRepository
from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.libs.ddd.repositories.page import Page
from pluralscan.libs.ddd.repositories.pagination import Pageable


class InMemoryProjectRepository(AbstractProjectRepository):
    """InMemoryProjectRepository"""

    def __init__(self):
        self._projects: Dict[ProjectId, Project] = {}

    def next_id(self) -> ProjectId:
        return ProjectId(uuid.uuid4())

    def find_one(self, namespace: str, source: ProjectSource) -> Optional[Project]:
        for project in self._projects.values():
            if project.source is source and project.namespace == namespace:
                return project
        return None

    def get_by_id(self, project_id: ProjectId) -> Project:
        return self._projects[project_id]

    def find_all(self, pageable: Pageable = Pageable()) -> Page[Project]:
        projects = list(self._projects.values())
        if pageable is None:
            return Page(
                items=projects,
                total_items=len(projects),
                page_number=1,
                page_size=15,
                total_pages=ceil(len(projects) / 15),
            )

        return Page(
            items=projects[pageable.offset() : pageable.offset() + pageable.page_size],
            total_items=len(projects),
            page_number=pageable.current_page(),
            page_size=pageable.page_size,
            total_pages=ceil(len(projects) / pageable.page_size),
        )

    def update(self, project: Project) -> Project:
        project = self.get_by_id(project.project_id)

        if project is None:
            raise Exception

        self._projects[project.project_id] = project

        return project

    def add(self, project: Project) -> Project:
        self._projects[project.project_id] = project
        return project

    def remove(self, project_id: ProjectId):
        project = self.get_by_id(project_id)

        if project is None:
            raise Exception

        self._projects.pop(project_id)
