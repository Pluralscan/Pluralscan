import uuid
from typing import Dict, List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository


class InMemoryAnalyzerRepository(AbstractAnalyzerRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist analyzers.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._analyzers: Dict[str, Analyzer] = {}

    def next_id(self) -> AnalyzerId:
        return AnalyzerId(uuid.uuid4())

    def find_by_id(self, analyzer_id: str) -> Analyzer:
        return self._analyzers.get(analyzer_id)

    def get_all(self) -> List[Analyzer]:
        return list(self._analyzers.values())

    def update(self, analyzer: Analyzer) -> Analyzer:
        analyzer = self.find_by_id(analyzer.analyzer_id)

        if analyzer is None:
            raise Exception

        self._analyzers[analyzer.analyzer_id] = analyzer

        return analyzer

    def add(self, analyzer: Analyzer) -> Analyzer:
        str_uuid = str(uuid.uuid4())

        if analyzer.analyzer_id is None:
            analyzer.analyzer_id = str_uuid

        self._analyzers[analyzer.analyzer_id] = analyzer

        return analyzer

    def remove(self, analyzer_id: str):
        analyzer = self.find_by_id(analyzer_id)

        if analyzer is None:
            raise Exception

        self._analyzers.pop(analyzer_id)

    def count(self) -> int:
        return len(self._analyzers.items())
