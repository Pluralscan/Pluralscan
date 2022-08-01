from abc import ABCMeta, abstractmethod
from typing import Optional

from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_source import ProjectSource
from pluralscan.libs.ddd.repositories.page import Page
from pluralscan.libs.ddd.repositories.pagination import Pageable


class AbstractProjectRepository(metaclass=ABCMeta):
    """
    Type: Abstract Repository\n
    DAO contract for projects persistence.
    """

    @abstractmethod
    def next_id(self) -> ProjectId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_by_id(self, project_id: ProjectId) -> Project:
        """get_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_one(self, namespace: str, source: ProjectSource) -> Optional[Project]:
        """find_one"""
        raise NotImplementedError()

    @abstractmethod
    def find_all(self, pageable: Pageable = Pageable()) -> Page[Project]:
        """find_all"""
        raise NotImplementedError()

    @abstractmethod
    def add(self, project: Project):
        """add"""
        raise NotImplementedError()

    @abstractmethod
    def update(self, project: Project) -> Project:
        """update"""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, project_id: ProjectId):
        """remove"""
        raise NotImplementedError()
