from abc import ABCMeta
from typing import List


class AbstractRepositoryFilter(metaclass=ABCMeta):
    """AbstractRepositoryFilter"""
    filters: List[any]

class Filter:
    def __init__(self) -> None:
        pass
