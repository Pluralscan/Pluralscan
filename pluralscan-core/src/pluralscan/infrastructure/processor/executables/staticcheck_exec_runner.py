import os
import pathlib
import subprocess
from os.path import exists
from subprocess import Popen
import tempfile
from typing import List
import zipfile

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner,
    ExecRunnerOptions,
    ProcessRunResult,
)


class StaticcheckExecRunner(AbstractExecRunner):
    """StaticcheckExecRunner"""

    def __init__(
        self, reports_output_dir: str = None, report_file_path: str = None
    ) -> None:
        self._reports_output_dir = reports_output_dir
        self._report_file_path = report_file_path
        self._mkdir_stack: List[str] = []

    def execute(self, options: ExecRunnerOptions) -> ProcessRunResult:
        raise NotImplementedError

    def execute_with_report(self, options: ExecRunnerOptions) -> ProcessRunResult:
        if not bool(self._reports_output_dir) or self._reports_output_dir is None:
            raise ValueError(
                "An output directory must be specified when requesting a process report."
            )

        if not bool(self._report_file_path) or self._report_file_path is None:
            raise ValueError(
                "A report file path must be specified when requesting a process report."
            )

        # Extract package
        temp_dir = tempfile.mkdtemp()
        self._mkdir_stack.append(temp_dir)
        with zipfile.ZipFile(options.package.storage_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)

        # Combine executable default arguments with options extra arguments.
        process_args = (
            options.executable.get_command_by_action(options.action).arguments
            + ['-f', 'json']
        )


        if not exists(self._reports_output_dir):
            os.makedirs(self._reports_output_dir)
            self._mkdir_stack.append(self._reports_output_dir)

        # If exists clear report with same name, else create empty one.
        with open(self._report_file_path, "w", encoding="UTF8") as file:
            file.close()

        with Popen(
            ' '.join(process_args),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
            shell=True, # TODO: Dangerous
        ) as process:
            output, errors = process.communicate()

            if bool(errors and not errors.isspace()):
                raise RuntimeError(errors)

            return ProcessRunResult(output, "SARIF")

    def _clean_up(self):
        pass
