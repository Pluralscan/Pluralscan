from dataclasses import dataclass
from typing import NamedTuple

from pluralscan.domain.sources.source_storage import (Sourcestorage,
                                                       Textstorage)


@dataclass(frozen=True)
class Issuestorage(NamedTuple):
    """Tuple with information about the storage of a breach insides source code."""
    absolute_path: str
    path: str
    module: str
    source_storage: Sourcestorage = None
    text_storage: Textstorage = None
