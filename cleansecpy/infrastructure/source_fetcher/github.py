from typing import Set

from cleansecpy.application.processor.source_service import AbstractSourceService, \
    FetchOptions, SourceResult, SourceResultType
from cleansecpy.domain.source.source import Source
from cleansecpy.infrastructure.downloader import DownloadResult, DownloaderOptions, IDownloader


class GithubSourceFetcher(AbstractSourceService):
    """Download source from github."""
    def __init__(self, downloader: IDownloader):
        self.downloader = downloader

    def fetch(self, uri: str, options: FetchOptions = FetchOptions()) -> SourceResult | Exception:
        options = DownloaderOptions(overwrite=options.overwrite)
        result: DownloadResult = self.downloader.download(uri, options=options)
        return SourceResult(result.path, SourceResultType.ARCHIVE)

    def read_sources(self, path: str) -> Set[Source]:
        pass
