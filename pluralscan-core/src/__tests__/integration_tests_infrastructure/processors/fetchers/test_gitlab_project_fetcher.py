from datetime import datetime
from pathlib import Path
from pluralscan.infrastructure.processor.fetchers.projects.gitlab_project_fetcher import GitlabProjectFetcher
import pytest
from __tests__.test_helpers import PACKAGES_DIR, SOURCES_DIR, TEMP_DIR



@pytest.fixture
def fetcher():
    return GitlabProjectFetcher()

def test_get_info(fetcher: GitlabProjectFetcher):
    url = "https://gitlab.com/Ipfaze/gat"
    project_info = fetcher.get_info(url)
    assert project_info is not None

def test_download(fetcher: GitlabProjectFetcher):
    url = "https://gitlab.com/Ipfaze/gat"
    output_dir = Path.joinpath(PACKAGES_DIR, "GITLAB/Ipfaze/gat/SNAPSHOT-test")
    result = fetcher.download(url, str(output_dir))
    assert result is not None

def test_parse_gitlab_url(fetcher: GitlabProjectFetcher):
    url = "https://gitlab.com/Ipfaze/gat"
    gitlab_namespace = fetcher.parse_gitlab_url(url)
    assert gitlab_namespace is not None
    assert gitlab_namespace == "Ipfaze/gat"
