from abc import ABCMeta, abstractmethod
from typing import Generic, TypeVar

TEntity = TypeVar("TEntity")
TKey = TypeVar("TKey")

class RepositoryBase(metaclass=ABCMeta):
    """
    RepositoryBase
    """

    @abstractmethod
    def exists(self, _id: TKey) -> bool:
        """
        Returns whether an entity with the given id exists.
        """
        raise NotImplementedError

    def count(self, _ = None) -> int:
        """
        Returns the total amount of elements in the repository.
        """
        raise NotImplementedError

class AbstractWriteRepository(Generic[TEntity], RepositoryBase, metaclass=ABCMeta):
    """AbstractWriteRepository"""
    def add(self, entity: TEntity) -> TEntity:
        """add"""
        raise NotImplementedError
