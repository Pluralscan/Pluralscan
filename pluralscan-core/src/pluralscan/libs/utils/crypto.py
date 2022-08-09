import hashlib
from pathlib import Path
from typing import Any


class CryptoUtils:
    """
    CryptoUtils
    """

    @staticmethod
    def get_file_sha256(filepath: Path) -> bytes:
        """_summary_

        Args:
            filepath (Path): _description_

        Returns:
            bytes: _description_
        """
        sha256_hash = hashlib.sha256()
        with open(filepath, "rb") as file:
            chunk: Any = None
            while chunk != b"":
                chunk = file.read(1024)
                sha256_hash.update(chunk)
        return sha256_hash.digest()
