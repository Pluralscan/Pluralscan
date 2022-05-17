import os
import traceback
import requests
from cleansecpy.libs.utils.http import HttpUtils
from cleansecpy.libs.utils.uri import UriUtils


from cleansecpy.infrastructure.downloader import DownloadResult, IDownloader, DownloaderOptions


class HttpDownloader(IDownloader):
    supported_extensions = [".zip"]

    def download(self, uri, options: DownloaderOptions = DownloaderOptions()) -> DownloadResult:
        extension = UriUtils.get_uri_extension(uri)

        if not extension in self.supported_extensions:
            raise ValueError("Unsupported uri extension.")

        if options is None:
            options = DownloaderOptions()

        try:
            options.output_filename = UriUtils.get_uri_filename(uri)
            return self._download_archive(uri, options)
        except:
            print(traceback.print_exc())
            return DownloadResult(error="")

    def _download_archive(self, uri: str, options: DownloaderOptions) -> DownloadResult:
        response = requests.get(uri)

        if not HttpUtils.is_http_success(response.status_code):
            raise Exception

        archive_path = os.path.join(options.output_dir, options.output_filename)
        with open(archive_path, 'wb') as stream:
            stream.write(response.content)
        return DownloadResult(path=archive_path)
