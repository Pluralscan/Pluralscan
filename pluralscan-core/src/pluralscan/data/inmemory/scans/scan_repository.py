import uuid
from typing import Dict, List

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_repository import AbstractScanRepository


class InMemoryScanRepository(AbstractScanRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist scans.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._scans: Dict[ScanId, Scan] = {}

    def next_id(self) -> ScanId:
        return ScanId(uuid.uuid4())

    def get_by_id(self, scan_id: ScanId) -> Scan:
        return self._scans.get(scan_id)

    def get_all(self) -> List[Scan]:
        return list(self._scans.values())

    def update(self, scan: Scan) -> Scan:
        scan = self.get_by_id(scan.scan_id)

        if scan is None:
            raise Exception

        self._scans[scan.scan_id] = scan

        return scan

    def add(self, scan: Scan) -> Scan:
        if scan.scan_id is None:
            scan.scan_id = self.next_id()

        self._scans[scan.scan_id] = scan

        return scan

    def add_bulk(self, scans: List[Scan]) -> List[Scan]:
        _scans = []
        for scan in scans:
            _scans.append(self.add(scan))
        return _scans

    def remove(self, scan_id: str):
        scan = self.get_by_id(scan_id)

        if scan is None:
            raise Exception

        self._scans.pop(scan_id)

    def count(self) -> int:
        return len(self._scans.items())
