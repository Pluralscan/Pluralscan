from dataclasses import dataclass
from pluralscan.libs.ddd.domain_event import AbstractDomainEvent

@dataclass(frozen=True)
class ScanReportAvailableEvent(AbstractDomainEvent):
    pass