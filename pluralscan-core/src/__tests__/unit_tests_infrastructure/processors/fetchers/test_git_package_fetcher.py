import pytest
from __tests__.test_helpers import SOURCES_DIR
from pluralscan.infrastructure.processor.fetchers.git_package_fetcher import (
    GitPackageFetcher, GitPackageFetcherOptions)


@pytest.fixture
def fetcher():
    options = GitPackageFetcherOptions(SOURCES_DIR)
    return GitPackageFetcher(options)


@pytest.mark.parametrize(
    "url, expected",
    [("https://github.com/gromatluidgi/cleansecpy", True), ("google.fr", False)],
)
def test_can_fetch(url, expected, fetcher: GitPackageFetcher):
    # Act
    result = fetcher.can_fetch(url)

    # Assert
    assert result is expected


def test_download():
    pass
