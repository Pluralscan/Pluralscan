from dataclasses import dataclass, field
from typing import Generic, List, TypeVar
from pluralscan.libs.ddd.domain_event import AbstractDomainEvent

TKey = TypeVar("TKey")

@dataclass
class AbstractAggregateRoot(Generic[TKey]):
    """AbstractAggregateRoot"""

    aggregate_id: TKey
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
