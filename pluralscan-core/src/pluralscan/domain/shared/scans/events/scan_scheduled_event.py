from dataclasses import dataclass
from typing import Any, Dict

from pluralscan.libs.ddd.domain_event import AbstractDomainEvent


@dataclass(frozen=True)
class ScanScheduledEvent(AbstractDomainEvent):
    """ScanUpdatedEvent"""

    data: Dict[str, Any]
