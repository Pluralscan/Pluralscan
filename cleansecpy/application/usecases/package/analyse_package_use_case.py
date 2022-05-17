from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from cleansecpy.application.processor.source_service import SourceResult, AbstractSourceService
from cleansecpy.application.usecases.analyzer.run_analyzer_use_case import AbstractRunAnalyzerUseCase
from cleansecpy.domain.diagnosys.diagnosys import Diagnosys
from cleansecpy.domain.package.package import Package
from cleansecpy.domain.package.package_repository import PackageRepository

# Input


@dataclass(frozen=True)
class AnalyzePackageCommand:
    """Analyze Package Command"""
    package_id: str
    analyze_id: str
    results_dir: str

# Output


@dataclass
class AnalyzePackageResult:
    diagnosys: Diagnosys

# Contract


class AbstractAnalyzePackageUseCase(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        raise NotImplementedError

# Default Implementation


class AnalyzePackageUseCase(AbstractAnalyzePackageUseCase):
    def __init__(
        self,
        run_analyzer_use_case: AbstractRunAnalyzerUseCase,
        package_repository: PackageRepository
    ):
        self._run_analyzer_use_case = run_analyzer_use_case
        self._package_repository = package_repository

    def handle(self, command: AnalyzePackageCommand) -> AnalyzePackageResult:
        
        return AnalyzePackageResult(package)
