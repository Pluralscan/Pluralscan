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
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Project]:
        """get_all"""
        raise NotImplementedError()

    @abstractmethod
    def add(self, project: Project) -> Project:
        """add"""
        raise NotImplementedError()

    @abstractmethod
    def update(self, project: Project) -> Project:
        """update"""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, project_id: str):
        """remove"""
        raise NotImplementedError()
