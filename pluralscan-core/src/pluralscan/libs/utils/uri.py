import os
import pathlib
from urllib.parse import urlparse


class UriUtils:
    """This class provide helper methods for manipulate uri."""

    @staticmethod
    def get_uri_extension(uri: str) -> str:
        """get_uri_extension"""
        if not uri:
            raise ValueError
        uri = uri.strip().lower()
        extension = pathlib.Path(uri).suffix
        return extension

    @staticmethod
    def get_uri_filename(uri: str, exclude_extension: bool = False) -> str:
        """Retrieve the filename with/out extension from given url."""
        if not uri:
            raise ValueError

        uri = uri.strip().lower()
        filename = os.path.basename(urlparse(uri).path)

        if exclude_extension:
            filename = os.path.splitext(filename)[0]

        return filename
