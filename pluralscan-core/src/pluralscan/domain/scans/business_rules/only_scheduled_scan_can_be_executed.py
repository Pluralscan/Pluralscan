from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.libs.ddd.rule import AbstractBusinessRule


class OnlyScheduledScanCanBeExecuted(AbstractBusinessRule):
    """OnlyScheduledScanCanBeExecuted

    Args:
        AbstractBusinessRule (_type_): _description_
    """

    def __init__(self, scan: Scan) -> None:
        self._scan = scan

    def is_broken(self) -> bool:
        return self._scan.state is not ScanState.SCHEDULED

    def message(self) -> str:
        return ""
