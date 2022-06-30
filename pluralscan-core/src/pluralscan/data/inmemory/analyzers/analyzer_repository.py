import uuid
from typing import Dict, List, Optional

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_filter import AnalyzerFilter
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.analyzer.analyzer_repository import \
    AbstractAnalyzerRepository
from pluralscan.domain.technologies.language import Language


class InMemoryAnalyzerRepository(AbstractAnalyzerRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist analyzers.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._analyzers: Dict[AnalyzerId, Analyzer] = {}

    def next_id(self) -> AnalyzerId:
        return AnalyzerId(uuid.uuid4())

    def get_one_by_id(self, analyzer_id: AnalyzerId) -> Analyzer:
        return self._analyzers[analyzer_id]

    def find_by_id(self, analyzer_id: AnalyzerId) -> Optional[Analyzer]:
        return self._analyzers.get(analyzer_id)

    def find_all(self, _: AnalyzerFilter = None) -> List[Analyzer]:
        return list(self._analyzers.values())

    def find_by_supported_language(self, language: Language) -> List[Analyzer]:
        return [x for x in self._analyzers.values() if language in x.supported_language]

    def update(self, analyzer: Analyzer) -> Analyzer:
        analyzer = self.get_one_by_id(analyzer.analyzer_id)

        if analyzer is None:
            raise Exception

        self._analyzers[analyzer.analyzer_id] = analyzer

        return analyzer

    def add(self, analyzer: Analyzer) -> Analyzer:
        if analyzer.analyzer_id is None:
            analyzer.analyzer_id = self.next_id()

        self._analyzers[analyzer.analyzer_id] = analyzer

        return analyzer

    def remove(self, analyzer_id: AnalyzerId):
        analyzer = self.get_one_by_id(analyzer_id)
        self._analyzers.pop(analyzer.analyzer_id)

    def count(self, _: AnalyzerFilter = None) -> int:
        return len(self._analyzers.items())
