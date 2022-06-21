from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher,
)
from pluralscan.domain.package.package import Package


@dataclass(frozen=True)
class GetRemotePackageInfoCommand:
    """GetRemotePackageInfoCommand"""

    url: str


class AbstractGetRemotePackageInfoUseCase(metaclass=ABCMeta):
    """
    Provide an abstract contract for retrieve package details from
    an external source.
    """

    @abstractmethod
    def handle(self, command: GetRemotePackageInfoCommand) -> Package:
        """Prepare requirements defined by the command and execute the use case."""
        raise NotImplementedError


class GetRemotePackageInfoUseCase(AbstractGetRemotePackageInfoUseCase):
    """GetRemotePackageInfoUseCase"""

    def __init__(self, package_fetcher: AbstractPackageFetcher):
        self._package_fetcher = package_fetcher

    def handle(self, command: GetRemotePackageInfoCommand) -> Package:
        # Check if package is fetchable
        if self._package_fetcher.can_fetch(command.url) is False:
            raise RuntimeError()

        # Fetch package info
        package_info = self._package_fetcher.get_info(command.url)
        if package_info.success is False:
            raise RuntimeError(package_info.error)

        return Package(
            name=package_info.name,
            version=package_info.version,
            location=command.url,
        )
