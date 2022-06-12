from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from cleansecpy.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
)
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import AbstractPackageRepository

# Input
@dataclass(frozen=True)
class GetRemotePackageInfoCommand:
    """"""
    url: str



# Output
@dataclass
class GetRemotePackageInfoResult:
    name: str
    version: str
    url: str


# Contract
class AbstractGetRemotePackageInfoUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, command: GetRemotePackageInfoCommand) -> GetRemotePackageInfoResult:
        raise NotImplementedError


# Default Implementation
class GetRemotePackageInfoUseCase(AbstractGetRemotePackageInfoUseCase):
    def __init__(
        self,
        package_fetcher: AbstractPackageFetcher
    ):
        self._package_fetcher = package_fetcher

    def handle(self, command: GetRemotePackageInfoCommand) -> GetRemotePackageInfoResult:
        # Check if package is fetchable
        if self._package_fetcher.can_fetch(command.url) is False:
            raise RuntimeError()
        
        # Fetch package info
        package_info = self._package_fetcher.get_info(command.url)
        if package_info.success is False:
            raise RuntimeError(package_info.error)

        return GetRemotePackageInfoResult(
            name=package_info.name,
            version="",
            url=command.url
        )
