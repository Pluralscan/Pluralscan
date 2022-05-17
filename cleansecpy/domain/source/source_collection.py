from dataclasses import dataclass
from typing import List
from cleansecpy.domain.source.source_id import SourceId


@dataclass(frozen=True)
class SourceCollection(List[SourceId]):
    "Sources Collection"
