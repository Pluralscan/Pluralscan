import pathlib
from __tests__.test_helpers import SOURCES_DIR
from pluralscan.application.usecases.projects.create_project import (
    CreateProjectCommand,
    CreateProjectUseCase,
)
from pluralscan.data.inmemory.projects.project_uow import (
    InMemoryCreateProjectUnitOfWork,
)
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


@pytest.fixture
def create_project_uow():
    return InMemoryCreateProjectUnitOfWork()


@pytest.mark.parametrize(
    "url,output_dir",
    [
        ("https://github.com/pluralscan/pluralscan", SOURCES_DIR),
        # ("https://gitlab.com/commento/commento"),
    ],
)
def test_handle_returns(url, output_dir, project_fetcher_factory, create_project_uow):
    # Arrange
    command = CreateProjectCommand(url, str(output_dir))
    usecase = CreateProjectUseCase(project_fetcher_factory, create_project_uow)

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None
