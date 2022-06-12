import pytest
from cleansecpy.application.processors.fetchers.package_fetcher import PackageFetcherOptions

from cleansecpy.infrastructure.processor.fetchers.git_package_fetcher import GitPackageFetcher
from tests.test_helpers import SOURCES_DIR


@pytest.fixture
def fetcher():
    options = PackageFetcherOptions(SOURCES_DIR)
    return GitPackageFetcher(options)

@pytest.mark.parametrize(
    "url, expected",
    [("https://github.com/gromatluidgi/cleansecpy", True),
     ("google.fr", False)]
)
def test_can_fetch(url, expected, fetcher: GitPackageFetcher):
    # Act
    result = fetcher.can_fetch(url)
    
    # Assert
    assert result is expected

def test_download():
    pass