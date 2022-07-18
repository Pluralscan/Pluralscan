# from abc import ABCMeta, abstractmethod
# from dataclasses import dataclass, field
# from typing import List, Optional

# from pluralscan.application.processors.fetchers.package_fetcher import \
#     AbstractPackageFetcher
# from pluralscan.domain.packages.package_origin import PackageOrigin
# from pluralscan.domain.packages.package_system import PackageSystem
# from pluralscan.domain.technologies.technology import Technology


# @dataclass(frozen=True)
# class GetRemotePackageInfoQuery:
#     """GetRemotePackageInfoCommand"""

#     url: str

# @dataclass(frozen=True)
# class GetRemotePackageInfoResult:
#     """GetRemotePackageInfoResult"""

#     name: str = field(default_factory=str)
#     full_name: Optional[str] = None
#     description: Optional[str] = None
#     version: Optional[str] = None
#     url: str = field(default_factory=str)
#     technologies: List[Technology] = field(default_factory=list)
#     origin: PackageOrigin = PackageOrigin.UNKNOWN


# class AbstractGetRemotePackageInfoUseCase(metaclass=ABCMeta):
#     """
#     Provide an abstract contract for retrieve package details from
#     an external source.
#     """

#     @abstractmethod
#     def handle(self, command: GetRemotePackageInfoQuery) -> GetRemotePackageInfoResult:
#         """Prepare requirements defined by the command and execute the use case."""
#         raise NotImplementedError


# class GetRemotePackageInfoUseCase(AbstractGetRemotePackageInfoUseCase):
#     """GetRemotePackageInfoUseCase"""

#     def __init__(self, package_fetcher: AbstractPackageFetcher):
#         self._package_fetcher = package_fetcher

#     def handle(self, command: GetRemotePackageInfoQuery) -> GetRemotePackageInfoResult:
#         # Check if package is fetchable
#         if self._package_fetcher.can_fetch(command.url) is False:
#             raise RuntimeError()

#         # Fetch package info
#         package_info = self._package_fetcher.get_info(command.url)
#         if package_info.success is False:
#             raise RuntimeError(package_info.error)

#         return GetRemotePackageInfoResult(
#             url=package_info.url
#         )
