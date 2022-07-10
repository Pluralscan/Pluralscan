# from abc import ABCMeta, abstractmethod
# from dataclasses import dataclass
# from typing import Optional

# from pluralscan.application.processors.fetchers.package_fetcher import (
#     AbstractPackageFetcher, AbstractPackageFetcherFactory,
#     DownloadPackageResult)
# from pluralscan.domain.packages.package import Package
# from pluralscan.domain.packages.package_repository import \
#     AbstractPackageRepository


# @dataclass(frozen=True)
# class CreatePackageCommand:
#     """New Package Command"""

#     name: str
#     uri: str
#     working_directory: str
#     description: Optional[str] = None


# @dataclass
# class CreatePackageResult:
#     """CreatePackageResult"""

#     package: Package


# class AbstractCreateackageUseCase(metaclass=ABCMeta):
#     """AbstractNewPackageUseCase"""

#     @abstractmethod
#     def handle(self, command: CreatePackageCommand) -> CreatePackageResult:
#         """handle"""
#         raise NotImplementedError


# class CreatePackageUseCase(AbstractCreateackageUseCase):
#     """CreatePackageUseCase"""

#     def __init__(
#         self,
#         package_fetcher_factory: AbstractPackageFetcherFactory,
#         package_repository: AbstractPackageRepository,
#     ):
#         self._package_fetcher_factory = package_fetcher_factory
#         self._package_repository = package_repository

#     def handle(self, command: CreatePackageCommand) -> CreatePackageResult:
#         # 1.
#         package_fetcher: AbstractPackageFetcher = self._package_fetcher_factory.create(
#             command.uri
#         )

#         # 2.
#         package_info = package_fetcher.get_info(command.uri)
#         if package_info is None or not package_info.success:
#             raise RuntimeError

# Check if a project exists for this package
#         # 3.
#         download_result: DownloadPackageResult = package_fetcher.download(
#             command.uri, command.working_directory
#         )
#         if download_result.success is not True:
#             raise RuntimeError(download_result.error)

#         # 4.
#         package_id = self._package_repository.next_id()
#         package = Package(
#             package_id=package_id,
#             name=package_info.name,
#             description=package_info.description,
#             storage_path=download_result.output_dir,
#             technologies=package_info.technologies,
#             registry=package_info.type,
#         )
#         package = self._package_repository.add(package)

#         return CreatePackageResult(package)
