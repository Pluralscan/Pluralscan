from dataclasses import dataclass
from typing import Generic, List, TypeVar
from pluralscan.libs.ddd.repositories.filter import Filter

from pluralscan.libs.ddd.repositories.sort import Sort


TEntity = TypeVar("TEntity")

@dataclass
class Page(Generic[TEntity]):
    """Page"""
    items: List[TEntity]
    total_items: int
    page_number: int
    total_pages: int
    sort: Sort = None
    filter: Filter = None
