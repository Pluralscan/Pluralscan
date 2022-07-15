from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
from typing import List, Optional
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import AbstractPackageRepository


from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.projects.project_repository import AbstractProjectRepository
from pluralscan.domain.projects.project_source import ProjectSource


@dataclass
class GetPackagesByProjectQuery:
    """GetPackagesByProjectQuery"""
    project_id: ProjectId


@dataclass
class GetPackagesByProjectResult:
    """CreateProjectResult"""

    packages: List[Package]


class AbstractGetPackagesByProjectUseCase(metaclass=ABCMeta):
    """AbstractFindProjectUseCase"""

    @abstractmethod
    def handle(self, query: GetPackagesByProjectQuery) -> GetPackagesByProjectResult:
        """handle"""
        raise NotImplementedError


class GetPackagesByProjectUseCase(AbstractGetPackagesByProjectUseCase):
    """GetPackagesByProjectUseCase"""

    def __init__(
        self,
        package_repository: AbstractPackageRepository,
    ) -> None:
        self._package_repository = package_repository

    def handle(self, query: GetPackagesByProjectQuery) -> GetPackagesByProjectResult:
        packages = self._package_repository.find_by_project(query.project_id)
        return GetPackagesByProjectResult(packages=packages)
