from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.application.processors.fetchers.project_fetcher import (
    AbstractProjectFetcherFactory, ProjectInfoResult)


@dataclass(frozen=True)
class GetRemoteProjectInfoQuery:
    """GetRemoteProjectInfoQuery"""

    url: str


@dataclass(frozen=True)
class GetRemoteProjectInfoResult:
    """GetRemoteProjectInfoResult"""

    info: ProjectInfoResult


class AbstractGetRemoteProjectInfoUseCase(metaclass=ABCMeta):
    """
    Provide an abstract contract for retrieve project details from
    an external source.
    """

    @abstractmethod
    def handle(self, query: GetRemoteProjectInfoQuery) -> GetRemoteProjectInfoResult:
        """Prepare requirements defined by the query and execute the use case."""
        raise NotImplementedError


class GetRemoteProjectInfoUseCase(AbstractGetRemoteProjectInfoUseCase):
    """GetRemoteProjectInfoUseCase"""

    def __init__(self, project_fetcher_factory: AbstractProjectFetcherFactory):
        self._project_fetcher_factory = project_fetcher_factory

    def handle(self, query: GetRemoteProjectInfoQuery) -> GetRemoteProjectInfoResult:
        # Create a project fetcher.
        project_fetcher = self._project_fetcher_factory.create(query.url)

        # Fetch package info
        project_info = project_fetcher.get_info(query.url)

        return GetRemoteProjectInfoResult(info=project_info)
