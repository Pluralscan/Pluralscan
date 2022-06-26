from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.domain.project.project import Project


@dataclass
class NewProjectRequest:
    limit: int = 50
    offset: int = 0

@dataclass
class NewProjectResult:
    project: Project


class AbstractNewProjectUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, request: NewProjectRequest) -> NewProjectResult:
        raise NotImplementedError


class NewProjectUseCase(AbstractNewProjectUseCase):
    def __init__(self) -> None:
        super().__init__()

    def handle(self, request: NewProjectRequest) -> NewProjectResult:
        return super().handle(request)
