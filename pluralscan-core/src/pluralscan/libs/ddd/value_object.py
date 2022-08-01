from abc import ABCMeta
from dataclasses import dataclass

@dataclass(frozen=True)
class ValueObject(metaclass=ABCMeta):
    pass