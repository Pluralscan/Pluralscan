from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from cleansecpy.application.processor.source_service import SourceResult, AbstractSourceService
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import PackageRepository

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
    package: Package

# Contract
class AbstractNewPackageUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, command: NewPackageCommand) -> NewPackageResult:
        raise NotImplementedError

# Default Implementation
class NewPackageUseCase(AbstractNewPackageUseCase):
    def __init__(self, source_service: AbstractSourceService, package_repo: PackageRepository):
        self.source_service = source_service
        self.package_repository = package_repo

    def handle(self, command: NewPackageCommand) -> NewPackageResult:
        source_result: SourceResult = self.source_service.fetch(command.url)
        package = command.map_to_package(source_result.path)
        package = self.package_repository.add(package)
        return NewPackageResult(package)