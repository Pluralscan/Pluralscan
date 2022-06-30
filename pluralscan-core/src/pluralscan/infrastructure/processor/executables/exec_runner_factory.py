import pathlib

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner, AbstractExecRunnerFactory)
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_runner import ExecutableRunner
from pluralscan.infrastructure.processor.executables.roslynator_exec_runner import \
    RoslynatorExecRunner


class ExecRunnerFactory(AbstractExecRunnerFactory):
    """Factory of abstract process runner"""

    def create(self, executable: Executable, working_directory: str) -> AbstractExecRunner:
        """Create a process runner according to executable type."""
        exec_type = executable.runner

        if exec_type is ExecutableRunner.ROSLYNATOR:
            output_directory = pathlib.Path(working_directory)
            report_file_path = pathlib.Path.joinpath(
                output_directory,
                f"Roslynator_Report.txt",
            )
            return RoslynatorExecRunner(str(output_directory), str(report_file_path))
        if exec_type is ExecutableRunner.SONAR:
            pass
        if exec_type is ExecutableRunner.ROSLYN:
            pass
