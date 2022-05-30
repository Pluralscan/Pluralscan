import os
from subprocess import Popen
import subprocess
from os.path import exists

from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner, ProcessOptions, ProcessRunResult


class WinExeProcessRunner(AbstractProcessRunner):
    """WinExeProcessRunner"""

    def execute(self, options: ProcessOptions) -> None | Exception:
        location = options.executable.location
        process = Popen([location, "-h"])
        exit_code = process.wait()
        print(exit_code)

    def execute_with_report(self, options: ProcessOptions) -> ProcessRunResult:
        if not bool(options.output_dir):
            raise ValueError(
                "An output directory must be specified when requesting a process report.")

        location = options.executable.location
        process_args = [x for xs in options.arguments for x in xs]

        if options.output_dir and not exists(options.output_dir):
            os.mkdir(options.output_dir)

        process = Popen([location, *process_args], stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE, universal_newlines=True)

        output, errors = process.communicate()

        print(output)

        if bool(errors and not errors.isspace()):
            raise RuntimeError(errors)

        return ProcessRunResult(os.listdir(options.output_dir))
