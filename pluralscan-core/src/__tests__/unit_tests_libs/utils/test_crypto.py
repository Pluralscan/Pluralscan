
from pathlib import Path

from __tests__.test_helpers import FIXTURES_DIR
from pluralscan.libs.utils.crypto import CryptoUtils


def test_get_file_sha256():
    # Arrange
    filepath = Path.joinpath(FIXTURES_DIR, "sha_256_file_test.txt")

    # Act
    sha256_hash = CryptoUtils.get_file_sha256(filepath)

    # Assert
    assert sha256_hash
    assert sha256_hash.hex() == 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'