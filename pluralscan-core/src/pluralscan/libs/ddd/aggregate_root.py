from abc import ABCMeta
from dataclasses import dataclass, field
from typing import List, TypeVar
from pluralscan.libs.ddd.domain_event import AbstractDomainEvent
from pluralscan.libs.ddd.entity import AbstractEntity

TKey = TypeVar("TKey")

@dataclass
class AbstractAggregateRoot(AbstractEntity[TKey], metaclass=ABCMeta):
    """AbstractAggregateRoot"""

    version: int
    _domain_events: List[AbstractDomainEvent] = field(init=False, repr=False, default_factory=list)

    @property
    def domain_events(self):
        """_summary_

        Returns:
            _type_: _description_
        """
        return self._domain_events

    def add_domain_event(self, event: AbstractDomainEvent):
        """add_domain_event"""
        self.domain_events.append(event)

    def remove_domain_event(self, event: AbstractDomainEvent):
        """remove_domain_event"""
        self.domain_events.remove(event)

    def clear_events(self):
        """remove_domain_event"""
        self.domain_events.clear()
