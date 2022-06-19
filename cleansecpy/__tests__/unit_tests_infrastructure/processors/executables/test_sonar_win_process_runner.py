from pathlib import Path
import pytest
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.executable.executable_platform import ExecutablePlatform
from cleansecpy.infrastructure.processor.executables.sonar_exec_runner import (
    SonarExecOptions,
    SonarExecRunner,
)
from __tests__.test_helpers import REPORTS_DIR, SOURCES_DIR, TOOLS_DIR


@pytest.fixture
def executable():
    executable_name = "SonarScanner.MSBuild.dll"
    executable_version = "5.6.0.48455-net5.0"
    executable_dir = Path.joinpath(
        TOOLS_DIR, "sonar-scanner-msbuild-5.6.0.48455-net5.0"
    )
    executable_path = Path.joinpath(executable_dir, executable_name)
    return Executable(
        ExecutablePlatform.WIN,
        executable_name,
        str(executable_path),
        executable_version,
    )


def test_execute_with_output(executable: Executable):
    # Arrange
    sonar_project_name = "Test"
    sonar_server_url = "http://localhost:9000"
    sonar_token = "52d488bf5da1ba60096763b44b82949d532ba65b"
    project_to_analyze = Path.joinpath(SOURCES_DIR, "AnalyzerTests\AnalyzerTests.sln")
    output_result_dir = Path.joinpath(REPORTS_DIR, "AnalyzerTests\SONAR_RESULTS")

    process_runner = SonarExecRunner(str(output_result_dir))
    process_options = SonarExecOptions(
        executable=executable,
        begin_arguments=[
            "dotnet",
            executable.location,
            "begin",
            f"/k:{sonar_project_name}",
            f"/d:sonar.host.url={sonar_server_url}",
            f"/d:sonar.login={sonar_token}",
            f"/d:sonar.scanner.metadataFilePath={str(output_result_dir)}",
        ],
        build_arguments=["dotnet", "build", str(project_to_analyze)],
        end_arguments=[
            "dotnet",
            executable.location,
            "end",
            f"/d:sonar.login={sonar_token}",
        ],
    )

    # Act
    result = process_runner.execute_with_report(process_options)

    # Assert
    assert result is not None
    assert result.success is True
