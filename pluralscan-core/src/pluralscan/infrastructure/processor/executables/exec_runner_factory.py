import pathlib

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner,
    AbstractExecRunnerFactory,
)
from pluralscan.domain.analyzers.executables.executable import Executable
from pluralscan.domain.analyzers.executables.executable_runner import ExecutableRunner
from pluralscan.infrastructure.processor.executables.clippy_exec_runner import ClippyExecRunner
from pluralscan.infrastructure.processor.executables.dependency_check_runner import (
    DependencyCheckExecRunner,
)
from pluralscan.infrastructure.processor.executables.roslynator_exec_runner import (
    RoslynatorExecRunner,
)
from pluralscan.infrastructure.processor.executables.staticcheck_exec_runner import StaticcheckExecRunner


class ExecRunnerFactory(AbstractExecRunnerFactory):
    """Factory of abstract process runner"""

    def create(
        self, executable: Executable, working_directory: str
    ) -> AbstractExecRunner:
        """Create a process runner according to executable type."""
        exec_type = executable.runner
        output_directory = pathlib.Path(working_directory)

        if exec_type is ExecutableRunner.ROSLYNATOR:
            report_file_path = pathlib.Path.joinpath(
                output_directory,
                "Roslynator_Report.txt",
            )
            return RoslynatorExecRunner(str(output_directory), str(report_file_path))
        if exec_type is ExecutableRunner.CLIPPY:
            report_file_path = pathlib.Path.joinpath(
                output_directory,
                "Clippy_Report.sarif",
            )
            return ClippyExecRunner(
                str(output_directory), str(report_file_path)
            )
        if exec_type is ExecutableRunner.ROSLYN:
            pass
        if exec_type is ExecutableRunner.DEPENDENCY_CHECK:
            report_file_path = pathlib.Path.joinpath(
                output_directory,
                "DependencyCheck_Report.sarif",
            )
            return DependencyCheckExecRunner(
                str(output_directory), str(report_file_path)
            )
        if exec_type is ExecutableRunner.STATICCHECK:
            report_file_path = pathlib.Path.joinpath(
                output_directory,
                "Staticcheck_Report.json",
            )
            return StaticcheckExecRunner(
                str(output_directory), str(report_file_path)
            )
        raise NotImplementedError
