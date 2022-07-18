from dataclasses import dataclass
from typing import Generic, List, Optional, TypeVar
from pluralscan.libs.ddd.repositories.filter import Filter

from pluralscan.libs.ddd.repositories.sort import Sort


TEntity = TypeVar("TEntity")


@dataclass
class Page(Generic[TEntity]):
    """Page"""

    items: List[TEntity]
    total_items: int
    page_number: int
    page_size: int
    total_pages: int
    sort: Optional[Sort] = None
    filter: Optional[Filter] = None
