import os
import pathlib
import subprocess
from os.path import exists
from subprocess import Popen

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner, ExecRunnerOptions, ProcessRunResult)
from pluralscan.infrastructure.config import Config


class RoslynatorExecRunner(AbstractExecRunner):
    """RoslynatorExeProcessRunner"""

    def __init__(
        self, reports_output_dir: str = None, report_file_path: str = None
    ) -> None:
        self._reports_output_dir = reports_output_dir
        self._report_file_path = report_file_path

    def execute(self, options: ExecRunnerOptions) -> ProcessRunResult:
        location = options.executable.location
        process_args = (
            options.executable.get_command_by_action(options.action).arguments
            + options.arguments
        )

        with Popen([location, *process_args]) as process:
            exit_code = process.wait()
            if exit_code == 0:
                return ProcessRunResult(None, True)

            return ProcessRunResult(exit_code, False)

    def execute_with_report(self, options: ExecRunnerOptions) -> ProcessRunResult:
        if not bool(self._reports_output_dir):
            raise ValueError(
                "An output directory must be specified when requesting a process report."
            )

        if not bool(self._report_file_path):
            raise ValueError(
                "A report file path must be specified when requesting a process report."
            )

        location = str(
            pathlib.Path.joinpath(Config.TOOLS_DIR, options.executable.location)
        )
        # Combine executable default arguments with options extra arguments.
        process_args = (
            options.executable.get_command_by_action(options.action).arguments
            + options.arguments
            + ["-o", self._report_file_path]
        )

        if not exists(self._reports_output_dir):
            os.makedirs(self._reports_output_dir)

        # If exists clear report with same name, else create empty one.
        with open(self._report_file_path, "w", encoding="UTF8") as file:
            file.close()

        with Popen(
            [location, *process_args],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
        ) as process:
            output, errors = process.communicate()

            if bool(errors and not errors.isspace()):
                raise RuntimeError(errors)

            return ProcessRunResult(output)