import pytest
from pluralscan.application.processors.fetchers.package_fetcher import PackageFetcherOptions

from pluralscan.infrastructure.processor.fetchers.github_package_fetcher import GithubPackageFetcher
from __tests__.test_helpers import SOURCES_DIR


@pytest.fixture
def fetcher():
    options = PackageFetcherOptions(SOURCES_DIR)
    return GithubPackageFetcher(options)

@pytest.mark.parametrize(
    "url, expected",
    [("https://github.com/gromatluidgi/cleansecpy", True),
     ("google.fr", False)]
)
def test_can_fetch(url, expected, fetcher: GithubPackageFetcher):
    # Act
    result = fetcher.can_fetch(url)
    
    # Assert
    assert result is expected

def test_get_info_raises_on_invalid_uri(fetcher: GithubPackageFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    package_info = fetcher.get_info(url)
    assert package_info is not None

def test_get_info(fetcher: GithubPackageFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    package_info = fetcher.get_info(url)
    assert package_info is not None

def test_download():
    pass

def test_clone():
    pass

def test_parse_github_url(fetcher: GithubPackageFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    github_repo = fetcher._parse_github_url(url)
    assert github_repo is not None