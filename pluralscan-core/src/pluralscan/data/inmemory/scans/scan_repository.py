from math import ceil
import uuid
from typing import Dict, List, Optional
from pluralscan.domain.packages.package_id import PackageId

from pluralscan.domain.scans.scan import Scan
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_repository import AbstractScanRepository
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.libs.ddd.event_dispatcher import AbstractEventDispatcher, MemoryEventDispatcher
from pluralscan.libs.ddd.repositories.page import Page
from pluralscan.libs.ddd.repositories.pagination import Pageable


class InMemoryScanRepository(AbstractScanRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist scans.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self, event_dispacher: AbstractEventDispatcher = MemoryEventDispatcher()):
        self._event_dispatcher = event_dispacher
        self._scans: Dict[ScanId, Scan] = {}

    def next_id(self) -> ScanId:
        return ScanId(str(uuid.uuid4()))

    def find_by_id(self, scan_id: ScanId) -> Optional[Scan]:
        return self._scans.get(scan_id)

    def find_all(self, pageable: Pageable = Pageable()) -> Page[Scan]:
        scans = list(self._scans.values())
        if pageable is None:
            return Page(
                items=scans,
                total_items=len(scans),
                page_number=1,
                page_size=15,
                total_pages=ceil(len(scans) / 15),
            )

        return Page(
            items=scans[pageable.offset() : pageable.offset() + pageable.page_size],
            total_items=len(scans),
            page_number=pageable.current_page(),
            page_size=pageable.page_size,
            total_pages=ceil(len(scans) / pageable.page_size),
        )

    def find_scheduled_by_package(self, package_id: PackageId) -> List[Scan]:
        scans = []
        for scan in self._scans.values():
            if scan.state is ScanState.SCHEDULED and scan.package_id == package_id:
                scans.append(scan)
        return scans

    def update(self, scan: Scan) -> Scan:
        self._scans[scan.aggregate_id] = scan
        self._event_dispatcher.dispatch(scan.domain_events)
        self._scans[scan.aggregate_id].clear_events()
        return self._scans[scan.aggregate_id]

    def add(self, scan: Scan) -> Scan:
        self._scans[scan.aggregate_id] = scan
        self._event_dispatcher.dispatch(scan.domain_events)
        self._scans[scan.aggregate_id].clear_events()
        return self._scans[scan.aggregate_id]

    def add_bulk(self, scans: List[Scan]) -> List[Scan]:
        _scans = []
        for scan in scans:
            _scans.append(self.add(scan))
        return _scans

    def remove(self, scan_id: ScanId):
        self._scans.pop(scan_id)

    def count(self) -> int:
        return len(self._scans.items())
