from datetime import datetime
from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource


def test_new_event():
    # Act
    result = Project(
        aggregate_id=ProjectId('Test'),
        name="",
        namespace="",
        source=ProjectSource.LOCAL,
        last_snapshot=datetime.now(),
        homepage=""
    )

    # Assert
    assert len(result.domain_events) is 1
    assert result.domain_events.pop().aggregate_id == "Test"
