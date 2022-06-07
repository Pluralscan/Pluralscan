from dataclasses import dataclass
from os.path import exists
import os
from subprocess import Popen
import subprocess
from typing import List
from cleansecpy.application.processor.executables.exec_runner import (
    AbstractExecRunner,
    ExecRunnerOptions,
    ProcessRunResult,
)


@dataclass
class SonarExecOptions(ExecRunnerOptions):
    """SonarProcessOptions"""

    begin_arguments: List[str] = None
    build_arguments: List[str] = None
    end_arguments: List[str] = None


class SonarExecRunner(AbstractExecRunner):
    """SonarExecRunner"""

    def __init__(self, reports_output_dir: str) -> None:
        self._reports_output_dir = reports_output_dir

    def execute(self, options: SonarExecOptions) -> ProcessRunResult | Exception:
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
