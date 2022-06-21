import pytest
from pluralscan.application.usecases.package.get_remote_package_info_use_case import (
    GetRemotePackageInfoCommand,
    GetRemotePackageInfoUseCase,
)
from pluralscan.infrastructure.processor.fetchers.github_package_fetcher import GithubPackageFetcher


@pytest.fixture
def package_fetcher():
    return GithubPackageFetcher()


def test_handle(package_fetcher):
    # Arrange
    url = "https://github.com/gromatluidgi/cleansecpy"
    command = GetRemotePackageInfoCommand(url)
    usecase = GetRemotePackageInfoUseCase(package_fetcher)

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None


def test_handle_raises_on_invalid_uri():
    pass
