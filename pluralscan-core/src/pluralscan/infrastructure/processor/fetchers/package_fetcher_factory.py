from pluralscan.application.processors.fetchers.package_fetcher import (
    AbstractPackageFetcher, AbstractPackageFetcherFactory)
from pluralscan.domain.package.package_origin import PackageOrigin
from pluralscan.infrastructure.processor.fetchers.disk_package_fetcher import \
    DiskPackageFetcher
from pluralscan.infrastructure.processor.fetchers.gitlab_package_fetcher import (
    GitlabPackageFetcher, GitlabPackageFetcherOptions)


class PackageFetcherFactory(AbstractPackageFetcherFactory):
    """PackageFetcherFactory"""

    def create(self, origin: PackageOrigin, working_dir: str) -> AbstractPackageFetcher:
        """create"""
        if origin == PackageOrigin.GITLAB:
            options = GitlabPackageFetcherOptions(working_dir)
            return GitlabPackageFetcher(options)

        if origin == PackageOrigin.LOCAL:
            return DiskPackageFetcher(working_dir)

        raise RuntimeError
