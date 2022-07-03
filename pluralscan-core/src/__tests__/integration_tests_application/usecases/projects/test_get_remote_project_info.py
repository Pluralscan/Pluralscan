from pluralscan.infrastructure.processor.fetchers.projects.project_fetcher_factory import (
    ProjectFetcherFactory,
)
import pytest
from pluralscan.application.usecases.projects.get_remote_project_info import (
    GetRemoteProjectInfoQuery,
    GetRemoteProjectInfoUseCase,
)


@pytest.fixture
def project_fetcher_factory():
    return ProjectFetcherFactory()


@pytest.mark.parametrize(
    "url",
    [
        ("https://github.com/gromatluidgi/cleansecpy"),
        ("https://gitlab.com/commento/commento"),
    ],
)
def test_handle_returns(url, project_fetcher_factory):
    # Arrange
    command = GetRemoteProjectInfoQuery(url)
    usecase = GetRemoteProjectInfoUseCase(project_fetcher_factory)

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None


@pytest.mark.parametrize(
    "url",
    [
        (""),
        (""),
    ],
)
def test_handle_raises(url, project_fetcher_factory):
    pass
