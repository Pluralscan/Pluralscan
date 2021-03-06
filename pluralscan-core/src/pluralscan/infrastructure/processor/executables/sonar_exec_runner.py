import os
import subprocess
from dataclasses import dataclass, field
from os.path import exists
from subprocess import Popen
from typing import List

from pluralscan.application.processors.executables.exec_runner import (
    AbstractExecRunner, ExecRunnerOptions, ProcessRunResult)


@dataclass(frozen=True)
class SonarExecOptions(ExecRunnerOptions):
    """SonarProcessOptions"""

    begin_arguments: List[str] = field(default_factory=list)
    build_arguments: List[str] = field(default_factory=list)
    end_arguments: List[str] = field(default_factory=list)


class SonarExecRunner(AbstractExecRunner):
    """SonarExecRunner"""

    def __init__(self, reports_output_dir: str) -> None:
        self._reports_output_dir = reports_output_dir

    def execute(self, options: SonarExecOptions) -> ProcessRunResult:
        raise NotImplementedError

    def execute_with_report(self, options: SonarExecOptions) -> ProcessRunResult:
        if not exists(self._reports_output_dir):
            os.makedirs(self._reports_output_dir)

        self._run_process(options.begin_arguments)
        self._run_process(options.build_arguments)
        self._run_process(options.end_arguments)
        return ProcessRunResult()

    @classmethod
    def _run_process(cls, arguments) -> None:
        process_args = [*arguments]
        with Popen(
            process_args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            universal_newlines=True,
        ) as process:
            output, errors = process.communicate()

            if bool(errors and not errors.isspace()):
                print(errors)
                raise RuntimeError(errors)

            print(output)
