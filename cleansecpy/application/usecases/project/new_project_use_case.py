from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List

from cleansecpy.domain.project.project import Project


# Input
@dataclass
class NewProjectRequest:
    limit: int = 50
    offset: int = 0

# Output
@dataclass
class NewProjectResult:
    project: Project

# Contract
class INewProjectUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, request: NewProjectRequest) -> NewProjectResult:
        raise NotImplementedError

# Default Implementation
class NewProjectUseCase(INewProjectUseCase):
    def __init__(self) -> None:
        super().__init__()

    def handle(self, request: NewProjectRequest) -> NewProjectResult:
        return super().handle(request)