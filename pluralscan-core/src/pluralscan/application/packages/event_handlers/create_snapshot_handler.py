# Default Implementation


from pluralscan.domain.shared.projects.events.project_created_event import (
    ProjectCreatedEvent,
)
from pluralscan.libs.ddd.event_dispatcher import AbstractEventDispatcher


class CreateSnapshotHandler:  # pylint: disable=too-few-public-methods
    """Fetch sources from new referenced project and create a package snapshot."""

    def __init__(self, event_dispatcher: AbstractEventDispatcher):
        event_dispatcher.subscribe(ProjectCreatedEvent.__name__, self.handle)

    def handle(self, event: ProjectCreatedEvent):
        """handle"""
        print(event.aggregate_id)
