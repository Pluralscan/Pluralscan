from dataclasses import dataclass
from datetime import datetime
from typing import List
from bson import SON, ObjectId

from pluralscan.domain.scans.scan_state import ScanState


@dataclass(frozen=True)
class ScanDocument(SON):
    """ScanDocument"""

    _id: ObjectId = None
    created_on: datetime = None
    modified_on: datetime = None
    analyzers: List[ObjectId] = None
    packages: List[ObjectId] = None
    state: ScanState = None
