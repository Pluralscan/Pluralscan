import pytest
from cleansecpy.application.usecases.analyzer.analyze_package_use_case import AnalyzePackageCommand, AnalyzePackageUseCase

from cleansecpy.data.inmemory.analyser_repository import InMemoryAnalyzerRepository
from cleansecpy.data.inmemory.package_repository import InMemoryPackageRepository
from cleansecpy.domain.analyzer.analyzer import Analyzer
from cleansecpy.domain.analyzer.analyzer_target import AnalyzerTarget
from cleansecpy.infrastructure.processor.process.win_exe_process import WinExeProcessRunner


@pytest.fixture
def package_repository(options):
    return InMemoryPackageRepository(options)


@pytest.fixture
def analyzer_repository(options):
    return InMemoryAnalyzerRepository(options)


@pytest.fixture
def win_process_runner():
    return WinExeProcessRunner()


def test_handle(package_repository, analyzer_repository, win_process_runner):
    command = AnalyzePackageCommand("", "", "")
    usecase = AnalyzePackageUseCase(package_repository, analyzer_repository, win_process_runner)

    result = usecase.handle(command)


def test_handle_raises_on_invalid_anlyzer_id():
    pass


def test_handle_raises_on_unsupported_target():
    pass


@pytest.mark.parametrize("analyzer, expected", [
    (Analyzer(supported_targets=[AnalyzerTarget.PACKAGE]), True),
    (Analyzer(supported_targets=[AnalyzerTarget.SOURCE]), False),
    (Analyzer(supported_targets=[
     AnalyzerTarget.SOURCE, AnalyzerTarget.DOCKER]), False)
])
def test_can_analyze_package(analyzer, expected):
    usecase = AnalyzePackageUseCase(package_repository, analyzer_repository, win_process_runner)
    result = usecase.can_analyze_package(analyzer)
    assert result == expected
