from abc import ABCMeta, abstractmethod
from typing import List, Optional

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_filter import AnalyzerFilter
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.technologies.technology import Technology
from pluralscan.libs.ddd.repositories.page import Page
from pluralscan.libs.ddd.repositories.pagination import Pageable


class AbstractAnalyzerRepository(metaclass=ABCMeta):
    """Abstract Analyzer repository."""

    def __del__(self):
        print(f"[!]  Garbage AnalyzerRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> AnalyzerId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_one_by_id(self, analyzer_id: AnalyzerId) -> Analyzer:
        """
        Returns a reference to an 'Analyzer" entity with the given identifier
        othewise raise exception.
        """
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, analyzer_id: AnalyzerId) -> Optional[Analyzer]:
        """
        Returns a reference to an 'Analyzer" entity with the given identifier.
        """
        raise NotImplementedError()

    @abstractmethod
    def find_many(self, analyzer_ids: List[AnalyzerId]) -> List[Analyzer]:
        """find_many"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_technologies(self, technologies: List[Technology]) -> List[Analyzer]:
        """find_by_technologies"""
        raise NotImplementedError()

    @abstractmethod
    def find_all(self, pageable: Pageable = Pageable()) -> Page[Analyzer]:
        """find_all"""
        raise NotImplementedError()

    @abstractmethod
    def add(self, analyzer: Analyzer) -> Analyzer:
        """
        Add a new Analyzer into the persistent store.
        """
        raise NotImplementedError()

    @abstractmethod
    def update(self, analyzer: Analyzer) -> Analyzer:
        """update"""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, analyzer_id: AnalyzerId) -> int:
        """remove"""
        raise NotImplementedError()

    @abstractmethod
    def count(self, filters: AnalyzerFilter = None) -> int:
        """count"""
        raise NotImplementedError()
