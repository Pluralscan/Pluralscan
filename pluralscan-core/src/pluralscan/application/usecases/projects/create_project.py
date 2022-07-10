import pathlib
from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcher,
    AbstractProjectFetcherFactory,
    DownloadProjectResult,
)
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_registry import PackageRegistry
from pluralscan.domain.packages.package_repository import AbstractPackageRepository
from pluralscan.domain.projects.project import Project
from pluralscan.domain.projects.project_repository import AbstractProjectRepository
from pluralscan.domain.technologies.technology import Technology


@dataclass
class CreateProjectCommand:
    """CreateProjectCommand"""

    uri: str
    working_directory: str


@dataclass
class CreateProjectResult:
    """CreateProjectResult"""

    project: Project
    package: Package


class AbstractCreateProjectUseCase(metaclass=ABCMeta):
    """AbstractCreateProjectUseCase"""

    @abstractmethod
    def handle(self, command: CreateProjectCommand) -> CreateProjectResult:
        """handle"""
        raise NotImplementedError


class AbstractCreateProjectUnitOfWork(metaclass=ABCMeta):
    """AbstractCreateProjectUseCase"""

    package_repository: AbstractPackageRepository
    project_repository: AbstractProjectRepository

    @abstractmethod
    def begin(self):
        """begin"""
        raise NotImplementedError

    @abstractmethod
    def commit(self):
        """begin"""
        raise NotImplementedError

    @abstractmethod
    def rollback(self):
        """begin"""
        raise NotImplementedError


class CreateProjectUseCase(AbstractCreateProjectUseCase):
    """CreateProjectUseCase"""

    def __init__(
        self,
        project_fetcher_factory: AbstractProjectFetcherFactory,
        unit_of_work: AbstractCreateProjectUnitOfWork,
    ) -> None:
        self._project_fetcher_factory = project_fetcher_factory
        self._project_repository = unit_of_work.project_repository
        self._package_repository = unit_of_work.package_repository

    def handle(self, command: CreateProjectCommand) -> CreateProjectResult:
        # Create the appropriate project fetcher
        project_fetcher: AbstractProjectFetcher = self._project_fetcher_factory.create(
            command.uri
        )

        # Get project informations
        project_info = project_fetcher.get_info(command.uri)
        if project_info is None:
            raise RuntimeError

        #TODO: detect redirection according to provided uri

        # Check if project is already referenced
        project = self._project_repository.find_one(
            name=project_info.name, source=project_info.source
        )
        if project is not None:
            raise RuntimeError

        # Create and persist a project entity
        project_id = self._project_repository.next_id()
        project = Project(
            project_id=project_id,
            name=project_info.display_name,
            namespace=project_info.name,
            source=project_info.source,
            last_snapshot=project_info.last_update,
            homepage=command.uri,
            language_metrics=project_info.language_metrics
        )
        self._project_repository.add(project)

        # Download project sources
        output_dir = pathlib.Path.joinpath(
            pathlib.Path(command.working_directory),
            project.snapshot_relative_path(),
        )

        download_result: DownloadProjectResult = project_fetcher.download(
            command.uri, str(output_dir)
        )
        if download_result.success is not True:
            raise RuntimeError(download_result.error)

        # Naive technology detection [TODO: use technology detector]
        technologies = []
        for metric in project_info.language_metrics:
            technology = Technology.from_code(metric.language.code)
            if technology is not None:
                technologies.append(technology)

        # Create a snapshot package
        package_id = self._package_repository.next_id()
        package = Package(
            package_id=package_id,
            name=project.name,
            version="SNAPSHOT",
            published_at=project.last_snapshot,
            registry=PackageRegistry.LOCAL,
            storage_path=download_result.output_dir,
            technologies=technologies
        )
        self._package_repository.add(package)

        return CreateProjectResult(project, package)
