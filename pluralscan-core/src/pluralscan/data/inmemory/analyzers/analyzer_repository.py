import uuid
from typing import List, Dict
from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId

from pluralscan.domain.analyzer.analyzer_repository import AbstractAnalyzerRepository
from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.executable.executable_platform import ExecutablePlatform


class InMemoryAnalyzerRepository(AbstractAnalyzerRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist analyzers.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._analyzers: Dict[str, Analyzer] = {
            "RoslynatorFork": Analyzer(
                analyzer_id="RoslynatorFork",
                name="Roslynator Fork",
                executables=[
                    Executable(
                        platform=ExecutablePlatform.WIN,
                        name="Roslynator.exe",
                        location="resources/tools/roslynator-fork-0.3.3.0/Roslynator.exe",
                        version="0.3.3.0"
                    )
                ]
            )
        }

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
        analyzer.analyzer_id = str_uuid

        self._analyzers[str_uuid] = analyzer

        return analyzer

    def remove(self, analyzer_id: str):
        analyzer = self.find_by_id(analyzer_id)

        if analyzer is None:
            raise Exception

        self._analyzers.pop(analyzer_id)

    def count(self) -> int:
        return len(self._analyzers.items())
