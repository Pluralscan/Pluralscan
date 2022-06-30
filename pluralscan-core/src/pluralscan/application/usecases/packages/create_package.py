from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.application.processors.fetchers.package_fetcher import \
    AbstractPackageFetcher
from pluralscan.domain.packages.package import Package
from pluralscan.domain.packages.package_repository import \
    AbstractPackageRepository


@dataclass(frozen=True)
class CreatePackageCommand:
    """New Package Command"""

    name: str
    url: str
    description: str = None


@dataclass
class CreatePackageResult:
    """CreatePackageResult"""

    package: Package


class AbstractCreateackageUseCase(metaclass=ABCMeta):
    """AbstractNewPackageUseCase"""

    @abstractmethod
    def handle(self, command: CreatePackageCommand) -> CreatePackageResult:
        """handle"""
        raise NotImplementedError


class CreatePackageUseCase(AbstractCreateackageUseCase):
    """CreatePackageUseCase"""

    def __init__(
        self,
        package_fetcher: AbstractPackageFetcher,
        package_repository: AbstractPackageRepository,
    ):
        self._package_fetcher = package_fetcher
        self._package_repository = package_repository

    def handle(self, command: CreatePackageCommand) -> CreatePackageResult:
        # source_result: SourceResult = self.source_service.fetch(command.url)
        # package = command.map_to_package(source_result.path)
        # package = self.package_repository.add(package)
        return CreatePackageResult(None)
