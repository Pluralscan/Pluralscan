from abc import ABCMeta
from typing import Any, List


class AbstractRepositoryFilter(metaclass=ABCMeta):
    """AbstractRepositoryFilter"""
    filters: List[Any]

class Filter:
    def __init__(self) -> None:
        pass
