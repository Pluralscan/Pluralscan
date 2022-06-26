from abc import ABCMeta, abstractmethod
from dataclasses import dataclass

from pluralscan.application.processors.fetchers.package_fetcher import \
    AbstractPackageFetcher
from pluralscan.domain.package.package import Package
from pluralscan.domain.package.package_repository import \
    AbstractPackageRepository


# Input
@dataclass(frozen=True)
class NewPackageCommand:
    """New Package Command"""

    name: str
    url: str
    description: str = None

    @classmethod
    def map_to_package(self, path: str) -> Package:
        return Package(name=self.name, url=self.url, description=self.description)


# Output
@dataclass
class NewPackageResult:
    """NewPackageResult"""
    package: Package


# Contract
class AbstractNewPackageUseCase(metaclass=ABCMeta):
    """AbstractNewPackageUseCase"""
    @abstractmethod
    def handle(self, command: NewPackageCommand) -> NewPackageResult:
        raise NotImplementedError


# Default Implementation
class NewPackageUseCase(AbstractNewPackageUseCase):
    """NewPackageUseCase"""
    def __init__(
        self,
        package_fetcher: AbstractPackageFetcher,
        package_repo: AbstractPackageRepository,
    ):
        self._package_fetcher = package_fetcher
        self.package_repository = package_repo

    def handle(self, command: NewPackageCommand) -> NewPackageResult:
        # source_result: SourceResult = self.source_service.fetch(command.url)
        # package = command.map_to_package(source_result.path)
        # package = self.package_repository.add(package)
        return NewPackageResult(None)
