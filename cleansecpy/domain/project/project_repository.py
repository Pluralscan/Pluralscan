from abc import ABCMeta, abstractmethod
from typing import List

from cleansecpy.domain.project.project import Project



class ProjectRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for projects persistence.
    """

    @abstractmethod
    def find_by_id(self, project_id: str) -> Project:
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Project]:
        raise NotImplementedError()

    @abstractmethod
    def add(self, project: Project) -> Project:
        raise NotImplementedError()

    @abstractmethod
    def update(self, project: Project) -> Project:
        raise NotImplementedError()

    @abstractmethod
    def remove(self, project_id: str):
        raise NotImplementedError()
