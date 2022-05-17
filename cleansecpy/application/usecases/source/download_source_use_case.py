from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from cleansecpy.application.processor.source_service import SourceResult, AbstractSourceService
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import PackageRepository

# Input
@dataclass(frozen=True)
class DownloadSourceCommand:
    """New Package Command"""
    name: str
    url: str
    description: str = None

# Output
@dataclass
class DownloadSourceResult:
    sources: Package

# Contract
class AbstractDownloadSourceUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, command: DownloadSourceCommand) -> DownloadSourceResult:
        raise NotImplementedError

# Default Implementation
class DownloadSourceUseCase(AbstractDownloadSourceUseCase):
    def __init__(self, source_service: AbstractSourceService, package_repo: PackageRepository):
        self.source_service = source_service
        self.package_repository = package_repo

    def handle(self, command: DownloadSourceCommand) -> DownloadSourceResult:
        source_result: SourceResult = self.source_service.fetch(command.url)
        package = command.map_to_package(source_result.path)
        package = self.package_repository.add(package)
        return DownloadSourceResult(package)