from datetime import datetime


from pluralscan.data.inmemory.projects.project_repository import InMemoryProjectRepository
from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource



class InMemoryProjectRepositorySeeder:
    """PackageRepositorySeeder"""

    def __init__(
        self,
        project_repository: InMemoryProjectRepository,
    ) -> None:
        """
        Construct a new 'InMemoryProjectRepositorySeeder' object.
        """
        self._project_repository = project_repository

    def seed(self):
        """Seed."""
        self._add_entities()

    def _add_entities(self):
        self._project_repository.add(
            Project(
                project_id=ProjectId("DemoProject"),
                name="DemoProject",
                source=ProjectSource.LOCAL,
                uri="https://demoproject.com",
                last_snapshot=datetime.now()
            )
        )
