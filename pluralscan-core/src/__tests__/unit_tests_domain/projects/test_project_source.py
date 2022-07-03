from pluralscan.domain.projects.project_source import ProjectSource
import pytest


@pytest.mark.parametrize(
    "url, expected",
    [
        ("https://github.com/gromatluidgi/cleansecpy", ProjectSource.GITHUB),
        ("https://gitlab.com/commento/commento", ProjectSource.GITLAB),
    ],
)
def test_detect_source(url, expected):
    # Act
    result = ProjectSource.detect_source(url)

    # Assert
    assert result is expected
