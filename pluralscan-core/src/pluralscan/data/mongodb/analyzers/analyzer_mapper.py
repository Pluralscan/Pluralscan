from typing import List

from pluralscan.data.mongodb.analyzers.analyzer_document import AnalyzerDocument
from pluralscan.domain.analyzer.analyzer import Analyzer


class AnalyzerMapper():
    """Provides helper functions that transform entities and document."""

    @staticmethod
    def to_document(analyzer: Analyzer) -> AnalyzerDocument:
        """Convert Analyzer entity to mongo document."""
        return AnalyzerDocument(
            _id=analyzer.analyzer_id,
            name=analyzer.name,
        )

    @staticmethod
    def from_document(document: AnalyzerDocument) -> Analyzer:
        """Convert mongo document to Analyzer entity."""
        if document is None:
            return None
        return Analyzer(
            document.get('_id'),
            document.get('name'),
        )

    @staticmethod
    def from_documents(documents: List[AnalyzerDocument]) -> List[Analyzer]:
        """Convert a list of mongo documents to a list of Analyzer entities."""
        analyers: List[Analyzer] = []
        for document in documents:
            analyers.append(AnalyzerMapper.from_document(document))
        return analyers
