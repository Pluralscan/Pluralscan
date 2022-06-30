from dataclasses import dataclass
from uuid import uuid4


@dataclass(frozen=True, init=False)
class ProjectId:
    """A value object representing a project unique identifier."""

    def __init__(self, identity = uuid4()):
        self.identity = str(identity)