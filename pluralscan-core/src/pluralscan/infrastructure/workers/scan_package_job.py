from pluralscan.application.usecases.scans.scan_package import (
    ScanPackageCommand,
    ScanPackageUseCase,
)
from pluralscan.domain.executable.executable_action import ExecutableAction


class ScanPackageWorker:
    """ScanPackageWorker"""

    def __init__(self) -> None:
        pass

    def run(self, scan_id: str):
        """run"""
        print("SCAN ID")
        print(scan_id)

        scan_package_use_case = ScanPackageUseCase(
            scan_repository=None,
            package_repository=None,
            executable_repository=None,
            diagnosis_repository=None,
            exec_runner_factory=None,
            report_processor=None,
        )

        command = ScanPackageCommand(
            scan_id=scan_id, executable_action=ExecutableAction.SCAN
        )

        scan_package_use_case.handle(command)

        return f"Scan ID: {0}".format(scan_id)