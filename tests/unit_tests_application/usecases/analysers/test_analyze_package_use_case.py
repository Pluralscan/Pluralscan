import pytest
from cleansecpy.application.usecases.package.analyze_package_use_case import (
    AnalyzePackageCommand,
    AnalyzePackageUseCase,
)

from cleansecpy.data.inmemory.analyser_repository import InMemoryAnalyzerRepository
from cleansecpy.data.inmemory.package_repository import InMemoryPackageRepository
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.analyzer.analyzer_target import AnalyzerTarget
from cleansecpy.domain.package.package_id import PackageId
from cleansecpy.infrastructure.processor.executables.roslynator_exec_runner import (
    RoslynatorExecRunner,
)


@pytest.fixture
def package_repository(options):
    return InMemoryPackageRepository(options)


@pytest.fixture
def analyzer_repository(options):
    return InMemoryAnalyzerRepository(options)


@pytest.fixture
def win_process_runner():
    return RoslynatorExecRunner()


def test_handle(package_repository, analyzer_repository, win_process_runner):
    # Arrange
    package_id = PackageId("Test")
    analyzer_id = AnalyzerId("Test")
    executable_version = "1.0"
    executable_arguments = [("analyze", ""), ("-o", "")]
    executable_dir = ""
    command = AnalyzePackageCommand(
        package_id,
        analyzer_id,
        executable_version,
        executable_dir,
        executable_arguments,
    )
    usecase = AnalyzePackageUseCase(
        package_repository, analyzer_repository, win_process_runner
    )

    # Act
    result = usecase.handle(command)

    # Assert
    assert result is not None


def test_handle_raises_on_invalid_anlyzer_id():
    pass


def test_handle_raises_on_unsupported_target():
    pass


def test_handle_raises_on_invalid_executable_version():
    pass


@pytest.mark.parametrize(
    "analyzer, expected",
    [
        (Analyzer(supported_targets=[AnalyzerTarget.PACKAGE]), True),
        (Analyzer(supported_targets=[AnalyzerTarget.SOURCE]), False),
        (
            Analyzer(supported_targets=[AnalyzerTarget.SOURCE, AnalyzerTarget.DOCKER]),
            False,
        ),
    ],
)
def test_can_analyze_package(analyzer, expected):
    usecase = AnalyzePackageUseCase(
        package_repository, analyzer_repository, win_process_runner
    )
    result = usecase.can_analyze_package(analyzer)
    assert result == expected
