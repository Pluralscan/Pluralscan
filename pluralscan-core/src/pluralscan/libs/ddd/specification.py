from abc import ABCMeta, abstractmethod


class AbstractSpecification(metaclass=ABCMeta):
    """AbstractSpecification"""

    @abstractmethod
    def is_satisfied_by(self, candidate: any) -> bool:
        """is_satisfied_by"""
        raise NotImplementedError
