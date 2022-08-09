from abc import ABCMeta, abstractmethod
from typing import Any


class AbstractSpecification(metaclass=ABCMeta):
    """AbstractSpecification"""

    @abstractmethod
    def is_satisfied_by(self, candidate: Any) -> bool:
        """is_satisfied_by"""
        raise NotImplementedError
