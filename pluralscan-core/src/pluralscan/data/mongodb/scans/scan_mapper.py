from typing import List
from pluralscan.data.mongodb.scans.scan_document import ScanDocument
from pluralscan.domain.scans.scan import Scan


class ScanMapper:
    """ScanMapper"""

    @staticmethod
    def to_document(scan: Scan) -> ScanDocument:
        """to_document"""
        return ScanDocument()

    @staticmethod
    def from_document(document: ScanDocument) -> Scan:
        """from_document"""
        if document is None:
            return None
        return Scan()

    @staticmethod
    def from_documents(documents: List[ScanDocument]) -> List[Scan]:
        """Convert a list of mongo documents to a list of Scan entities."""
        scans: List[Scan] = []
        for document in documents:
            scans.append(ScanMapper.from_document(document))
        return scans
