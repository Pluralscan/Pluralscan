from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.analyzer.analyzer import Analyzer
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId


class AbstractAnalyzerRepository(metaclass=ABCMeta):
    """Abstract Analyzer repository."""
    def __del__(self):
        print(f"[!]  Garbage AnalyzerRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> AnalyzerId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, analyzer_id: str) -> Analyzer:
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Analyzer]:
        """get_all"""
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
    def remove(self, analyzer_id: str) -> int:
        """remove"""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """count"""
        raise NotImplementedError()