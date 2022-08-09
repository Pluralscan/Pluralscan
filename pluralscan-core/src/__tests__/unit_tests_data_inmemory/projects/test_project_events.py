from datetime import datetime

import pytest
from pluralscan.application.projects.event_handlers.project_created_handler import ProjectCreatedHandler
from pluralscan.data.inmemory.projects.project_repository import InMemoryProjectRepository
from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource

@pytest.fixture
def repository():
    return InMemoryProjectRepository()
    
def test_new_event(repository: InMemoryProjectRepository):
    # Arrange
    ProjectCreatedHandler(repository._event_dispatcher)
    project = Project(
        aggregate_id=ProjectId('Test'),
        name="",
        namespace="",
        source=ProjectSource.LOCAL,
        last_snapshot=datetime.now(),
        homepage=""
    )

    # Act
    result = repository.add(project)

    # Assert
    assert len(result.domain_events) == 1
    assert result.domain_events.pop().aggregate_id == "Test"