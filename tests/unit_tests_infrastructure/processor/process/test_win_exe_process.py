import os
from pathlib import Path
import pytest
from cleansecpy import SOURCES_DIR, TOOLS_DIR
from cleansecpy.application.processor.process.process_runner import ProcessOptions
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.executable.executable_type import ExecutableType
from cleansecpy.infrastructure.processor.process.win_exe_process import WinExeProcessRunner

@pytest.fixture
def executable():
    executable_name = "Roslynator.exe"
    executable_dir = Path.joinpath(TOOLS_DIR, 'roslynator-custom-build')
    executable_path = Path.joinpath(executable_dir, executable_name)
    return Executable(ExecutableType.WIN64_EXE, executable_name, str(executable_path))

def test_execute_with_output(executable):
    # Arrange
    project_to_analyze = Path.joinpath(SOURCES_DIR, 'AnalyzerTests\AnalyzerTests.sln')
    output_result_dir = Path.joinpath(SOURCES_DIR, 'AnalyzerTests\ROSLYNATOR_RESULTS')
    extra_arguments = [('analyze', str(project_to_analyze)), ('-o', str(Path.joinpath(output_result_dir, 'RoslynatorResults.txt')))]
    options = ProcessOptions(executable, str(output_result_dir), extra_arguments)
    process_runner = WinExeProcessRunner()

    # Act
    result = process_runner.execute_with_report(options)

    # Assert
    assert result is not None
    assert len(result.output_files) is 1

def test_execute(executable):
    options = ProcessOptions(executable)
    process_runner = WinExeProcessRunner()

    result = process_runner.execute(options)

    assert result is None