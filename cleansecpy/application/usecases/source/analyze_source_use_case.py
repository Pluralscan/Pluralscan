from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from typing import List
from cleansecpy.application.processor.source_service import SourceResult, AbstractSourceService
from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import PackageRepository

# Input
@dataclass(frozen=True)
class AnalyzeSourceCommand:
    """Analyze Source Command"""
    path: str
    analyzer_id: AnalyzerId

# Output
@dataclass
class AnalyzeSourceResult:
    package: Package = None

# Contract
class AbstractAnalyzeSourceUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, command: AnalyzeSourceCommand) -> AnalyzeSourceResult:
        raise NotImplementedError

# Default Implementation
class AnalyzeSourceUseCase(AbstractAnalyzeSourceUseCase):
    def __init__(self, analyzer_service: AbstractSourceService, package_repo: PackageRepository):
        self._analyzer_service = analyzer_service
        self._package_repository = package_repo

    def handle(self, command: AnalyzeSourceCommand) -> AnalyzeSourceResult:
        return AnalyzeSourceResult()