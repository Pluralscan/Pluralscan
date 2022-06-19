from pathlib import Path
import pytest
from cleansecpy.application.processors.executables.exec_runner import (
    ExecRunnerOptions,
)
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.executable.executable_platform import ExecutablePlatform
from cleansecpy.infrastructure.processor.executables.roslynator_exec_runner import (
    RoslynatorExecRunner,
)
from __tests__.test_helpers import REPORTS_DIR, SOURCES_DIR, TOOLS_DIR


@pytest.fixture
def executable():
    executable_name = "Roslynator.exe"
    executable_dir = Path.joinpath(TOOLS_DIR, "roslynator-fork-0.3.3.0")
    executable_path = Path.joinpath(executable_dir, executable_name)
    return Executable(ExecutablePlatform.WIN, executable_name, str(executable_path))


def test_execute_with_output(executable):
    # Arrange
    project_to_analyze = Path.joinpath(SOURCES_DIR, "AnalyzerTests\AnalyzerTests.sln")
    output_result_dir = Path.joinpath(REPORTS_DIR, "AnalyzerTests\ROSLYNATOR_RESULTS")
    report_path = str(Path.joinpath(output_result_dir, "RoslynatorResults.txt"))
    extra_arguments = [("analyze", str(project_to_analyze)), ("-o", report_path)]
    options = ExecRunnerOptions(executable, extra_arguments)
    process_runner = RoslynatorExecRunner(output_result_dir, report_path)

    # Act
    result = process_runner.execute_with_report(options)

    # Assert
    assert result is not None
    assert result.success is True


def test_execute(executable):
    options = ExecRunnerOptions(executable)
    process_runner = RoslynatorExecRunner()

    result = process_runner.execute(options)

    assert result is None
