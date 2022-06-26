from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.executable.executable_id import ExecutableId
from pluralscan.domain.executable.executable_specification import \
    ExecutablesSpecification


class AbstractExecutableRepository(metaclass=ABCMeta):
    """Abstract Analyzer repository."""
    def __del__(self):
        print(f"[!]  Garbage AnalyzerRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> ExecutableId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def find(self, specification: ExecutablesSpecification) -> List[Executable]:
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_analyzer(self, analyzer_id: str) -> List[Executable]:
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, executable_id: ExecutableId) -> Executable:
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Executable]:
        """get_all"""
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
