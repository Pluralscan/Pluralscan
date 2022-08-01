from dataclasses import dataclass
from typing import Any
from pluralscan.libs.ddd.domain_event import AbstractDomainEvent


@dataclass(frozen=True)
class ScanUpdatedEvent(AbstractDomainEvent):
    """ScanUpdatedEvent"""

    data: Any
