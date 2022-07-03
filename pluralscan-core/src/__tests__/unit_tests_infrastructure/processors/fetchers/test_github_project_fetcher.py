import pytest
from __tests__.test_helpers import SOURCES_DIR
from pluralscan.infrastructure.processor.fetchers.projects.github_project_fetcher import \
    GithubProjectFetcher


@pytest.fixture
def fetcher():
    return GithubProjectFetcher()

def test_get_info_raises_on_invalid_uri(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    package_info = fetcher.get_info(url)
    assert package_info is not None

def test_get_info(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    package_info = fetcher.get_info(url)
    assert package_info is not None

def test_download():
    pass

def test_clone():
    pass

def test_parse_github_url(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    github_repo = fetcher._parse_github_url(url)
    assert github_repo is not None
