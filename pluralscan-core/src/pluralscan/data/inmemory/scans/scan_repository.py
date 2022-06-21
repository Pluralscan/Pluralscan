import uuid
import datetime
from datetime import timezone
from typing import List, Dict
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
        self._scans: Dict[str, Scan] = {
            "Scan01": Scan(
                scan_id=ScanId("Scan01"),
                created_on=datetime.datetime.now(timezone.utc),
                modified_on=datetime.datetime.now(timezone.utc),
            )
        }

    def next_id(self) -> ScanId:
        return ScanId(uuid.uuid4())

    def find_by_id(self, scan_id: str) -> Scan:
        return self._scans.get(scan_id)

    def get_all(self) -> List[Scan]:
        return list(self._scans.values())

    def update(self, scan: Scan) -> Scan:
        scan = self.find_by_id(scan.scan_id)

        if scan is None:
            raise Exception

        self._scans[scan.scan_id] = scan

        return scan

    def add(self, scan: Scan) -> Scan:
        str_uuid = str(uuid.uuid4())
        scan.scan_id = str_uuid

        self._scans[str_uuid] = scan

        return scan

    def remove(self, scan_id: str):
        scan = self.find_by_id(scan_id)

        if scan is None:
            raise Exception

        self._scans.pop(scan_id)

    def count(self) -> int:
        return len(self._scans.items())
