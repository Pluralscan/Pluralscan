from dataclasses import dataclass
from typing import NamedTuple

from pluralscan.domain.source.source_location import SourceLocation, TextLocation


@dataclass(frozen=True)
class IssueLocation(NamedTuple):
    """Tuple with information about the location of a breach insides source code."""
    absolute_path: str
    path: str
    module: str
    source_location: SourceLocation = None
    text_location: TextLocation = None
