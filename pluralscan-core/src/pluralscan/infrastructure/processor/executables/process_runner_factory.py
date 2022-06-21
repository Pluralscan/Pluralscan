from pluralscan.application.processors.executables.exec_runner import AbstractExecRunner
from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.executable.executable_platform import ExecutablePlatform


class ProcessRunnerFactory:
    """Factory of abstract process runner0"""

    @staticmethod
    def create_process_runner(executable: Executable) -> AbstractExecRunner:
        """Create a process runner according to executable type."""
        exec_type = executable.platform
        if exec_type is ExecutablePlatform.INTERNAL:
            pass
        if exec_type is ExecutablePlatform.WIN:
            pass
        if exec_type is ExecutablePlatform.DOTNET:
            pass
