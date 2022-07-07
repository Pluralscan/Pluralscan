from abc import ABCMeta, abstractmethod
from typing import List, Optional

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.libs.ddd.repositories.pagination import Pageable


class AbstractExecutableRepository(metaclass=ABCMeta):
    """Abstract Analyzer repository."""
    def __del__(self):
        print(f"[!]  Garbage AnalyzerRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> ExecutableId:
        """next_id"""
        raise NotImplementedError()


    @abstractmethod
    def find_by_analyzer(self, analyzer_id: AnalyzerId, pageable: Pageable = Pageable()) -> List[Executable]:
        """get_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, executable_id: ExecutableId) -> Optional[Executable]:
        """Returns a reference to an 'Executable" entity with the given identifier."""
        raise NotImplementedError()

    @abstractmethod
    def find_many(self, executable_ids: List[ExecutableId]) -> List[Executable]:
        """find_many"""
        raise NotImplementedError()

    @abstractmethod
    def find_all(self) -> List[Executable]:
        """find_all"""
        raise NotImplementedError()

    @abstractmethod
    def add(self, executable: Executable) -> Executable:
        """
        Add a new Analyzer into the persistent store.
        """
        raise NotImplementedError()

    @abstractmethod
    def update(self, executable: Executable) -> Executable:
        """update"""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, executable_id: ExecutableId) -> int:
        """remove"""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """count"""
        raise NotImplementedError()
