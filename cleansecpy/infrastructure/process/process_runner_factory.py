from cleansecpy.application.processor.process.process_runner import AbstractProcessRunner
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.executable.executable_type import ExecutableType


class ProcessRunnerFactory():
    """Factory of abstract process runner0"""
    @staticmethod
    def create_process_runner(executable: Executable) -> AbstractProcessRunner:
        """Create a process runner according to executable type."""
        exec_type = executable.type
        if exec_type is ExecutableType.INTERNAL:
            pass
        if exec_type is ExecutableType.WIN32_EXE:
            pass
        if exec_type is ExecutableType.WIN64_EXE:
            pass
