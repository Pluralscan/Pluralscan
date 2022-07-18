from datetime import datetime
from pathlib import Path
import pytest
from __tests__.test_helpers import PACKAGES_DIR, SOURCES_DIR, TEMP_DIR
from pluralscan.infrastructure.processor.fetchers.projects.github_project_fetcher import \
    GithubProjectFetcher


@pytest.fixture
def fetcher():
    return GithubProjectFetcher()

def test_get_info(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    project_info = fetcher.get_info(url)
    assert project_info is not None

def test_download(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    output_dir = Path.joinpath(PACKAGES_DIR, "GITHUB/gromatluidgi/cleansecpy/SNAPSHOT-test")
    result = fetcher.download(url, str(output_dir))
    assert result is not None

def test_clone():
    pass

def test_parse_github_url(fetcher: GithubProjectFetcher):
    url = "https://github.com/gromatluidgi/cleansecpy"
    github_repo = fetcher._parse_github_url(url)
    assert github_repo is not None
