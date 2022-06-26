from abc import ABCMeta, abstractmethod
from typing import List

from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_id import DiagnosisId


class AbstractDiagnosisRepository(metaclass=ABCMeta):
    """Abstract Diagnosis repository."""
    def __del__(self):
        print(f"[!]  Garbage DiagnosisRepository -> {self.__class__.__name__}")

    @abstractmethod
    def next_id(self) -> DiagnosisId:
        """next_id"""
        raise NotImplementedError()

    @abstractmethod
    def find_by_id(self, diagnosis_id: str) -> Diagnosis:
        """find_by_id"""
        raise NotImplementedError()

    @abstractmethod
    def get_all(self) -> List[Diagnosis]:
        """get_all"""
        raise NotImplementedError()

    @abstractmethod
    def add(self, diagnosis: Diagnosis) -> Diagnosis:
        """
        Add a new Diagnosis into the persistent store.
        """
        raise NotImplementedError()

    @abstractmethod
    def update(self, diagnosis: Diagnosis) -> Diagnosis:
        """update"""
        raise NotImplementedError()

    @abstractmethod
    def remove(self, diagnosis_id: str) -> int:
        """remove"""
        raise NotImplementedError()

    @abstractmethod
    def count(self) -> int:
        """count"""
        raise NotImplementedError()
