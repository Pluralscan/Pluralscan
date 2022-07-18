from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.domain.projects.project_id import ProjectId


@dataclass(frozen=True)
class GetLatestSnapshotResult:
    """GetPackageByIdResult"""

    package: Package


class AbstractGetLatestSnapshotUseCase(
    metaclass=ABCMeta
):  # pylint: disable=too-few-public-methods
    """AbstractGetPackageByIdUseCase"""

    @abstractmethod
    def handle(self, project_id: ProjectId) -> GetLatestSnapshotResult:
        """handle"""
        raise NotImplementedError


class GetLatestSnapshotUseCase(
    AbstractGetLatestSnapshotUseCase
):  # pylint: disable=too-few-public-methods
    """GetLatestSnapshotUseCase"""

    def __init__(self, package_repository: AbstractPackageRepository):
        self._package_repository = package_repository

    def handle(self, project_id: ProjectId) -> GetLatestSnapshotResult:
        packages = self._package_repository.find_by_project(project_id)
        if len(packages) == 0:
            raise RuntimeError
        packages.sort(key=lambda p: p.published_at, reverse=True)
        return GetLatestSnapshotResult(packages.pop(0))
