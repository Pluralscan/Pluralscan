from abc import ABCMeta, abstractmethod
from dataclasses import dataclass
import random
import string
import time

from cleansecpy.domain.config import Config

# Input
@dataclass
class DownloaderOptions():
    output_dir: str = None
    output_filename: str = None
    credentials = None
    overwrite: bool = True

    def __post_init__(self):
        config = Config()
        self.output_dir = config.resources_dir
        self.output_filename = self._random_filename()

    @classmethod
    def _random_filename(self) -> str:
        letters = string.ascii_lowercase
        random_string = ( ''.join(random.choice(letters) for i in range(10)) )
        return f"{random_string}-{time.asctime}" 

# Output
@dataclass
class DownloadResult:
    path: str = None
    filename: str = None
    extension: str = None
    error: str = None
    success: bool = error is None

# Contract
class IDownloader(metaclass=ABCMeta):

    @abstractmethod
    def download(uri: str, options: DownloaderOptions = DownloaderOptions()) -> DownloadResult:
        raise NotImplementedError