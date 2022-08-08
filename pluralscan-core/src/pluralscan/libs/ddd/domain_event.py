from abc import ABCMeta
from dataclasses import dataclass, field
from uuid import uuid4


@dataclass(frozen=True)
class AbstractDomainEvent(metaclass=ABCMeta):
    """AbstractDomainEvent"""

    aggregate_id: str
    event_id: str = field(init=False, default_factory=uuid4().__str__)

    def __repr__(self) -> str:
        return self.__class__.__name__
