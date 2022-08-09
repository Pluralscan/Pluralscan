from abc import ABCMeta, abstractmethod


class AbstractBusinessRule(metaclass=ABCMeta):
    """AbstractBusinessRule"""

    @abstractmethod
    def is_broken(self) -> bool:
        """is_broken"""
        raise NotImplementedError

    @abstractmethod
    def message(self) -> str:
        """Details about rule validation issue."""
        raise NotImplementedError
