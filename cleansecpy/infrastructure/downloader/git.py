from http.client import responses
import traceback
import requests


from cleansecpy.infrastructure.downloader import DownloadResult, IDownloader, DownloaderOptions
from cleansecpy.libs.utils.uri import UriUtils


class GitDownloader(IDownloader):
    supported_extensions = [".git"]

    def download(self, uri, options: DownloaderOptions = ...) -> DownloadResult:
        extension = UriUtils.get_uri_extension(uri)

        if not extension in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        try:
            return self._clone(uri, options)
        except:
            print(traceback.print_exc())
            return DownloadResult(error="")

    def _clone(self, uri: str, options: DownloaderOptions) -> DownloadResult:
        response = requests.get(uri)
        archive_path = options.output_dir + UriUtils.get_uri_filename(uri)
        with open(archive_path, 'wb') as stream:
            stream.write(response.content)
        return DownloadResult(path=archive_path)
