from abc import ABCMeta, abstractmethod
import asyncio
from collections import defaultdict
from typing import Any, Dict, List, Set

from pluralscan.libs.ddd.domain_event import AbstractDomainEvent

class AbstractEventDispatcher(metaclass=ABCMeta):
    """AbstractEventDispatcher"""

    @abstractmethod
    def subscribe(self, event_name: str, subscriber: Any):
        """subscribe"""
        raise NotImplementedError

    @abstractmethod
    def dispatch(self, events: List[AbstractDomainEvent]):
        """subscribe"""
        raise NotImplementedError

class MemoryEventDispatcher(AbstractEventDispatcher):
    """
    Memory Event Dispatcher class to run async subscribers
    """

    def __init__(self):
        self._store: Set[AbstractDomainEvent] = set()
        self._subscriptions: Dict[str, Set] = defaultdict(set)

    def __str__(self):
        return "MemoryEventDispatcher"

    def __repr__(self):
        return f"<MemoryEventDispatcher: {len(self._subscriptions.items())} events>"

    @property
    def subscriptions(self):
        """
        Property for returning events and their respective subscribers
        :return: Events and their respective subscribers
        """
        return self._subscriptions


    def subscribe(self, event_name: str, subscriber):
        """
        Method for subscribing a handler to an event
        :param event_name: Event name for subscribing
        :param subscriber: Subscriber of the event
        """
        self.subscriptions[event_name].add(subscriber)

    def dispatch(self, events: List[AbstractDomainEvent]):
        """
        Method for dispatching a stack of events
        :param event_name: Event name for emitting their subscribers
        """
        for event in events:
            subscribers = self.subscriptions[event.__class__.__name__]
            if not subscribers:
                continue
            asyncio.run(self.__run_subscribers(subscribers, event))

    async def __run_subscribers(self, subscribers, event):
        await asyncio.wait([subscriber(event) for subscriber in subscribers])
