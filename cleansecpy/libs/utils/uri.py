import os
import pathlib
from urllib.parse import urlparse


class UriUtils:
        @staticmethod
        def get_uri_extension(uri: str) -> str:
            if not uri:
                raise ValueError
            uri = uri.strip().lower()
            extension = pathlib.Path(uri).suffix
            return extension

        @staticmethod
        def get_uri_filename(uri: str) -> str:
            """Retrieve the filename with extension from given url."""
            if not uri:
                raise ValueError
            uri = uri.strip().lower()
            filename = os.path.basename(urlparse(uri).path)
            return filename