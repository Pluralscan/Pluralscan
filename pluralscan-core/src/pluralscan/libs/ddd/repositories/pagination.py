
from dataclasses import dataclass


@dataclass(frozen=True)
class Pageable:
    """Pageable"""
    page_number: int = 0
    page_size: int = 100

    def offset(self) -> int:
        """Returns the offset to be taken according to the underlying page and page size."""
        offset = self.page_number
        if offset > 0:
            offset = self.page_number * self.page_size
        return offset

    def current_page(self) -> int:
        """Returns the page to be returned."""
        if self.page_number < 1:
            return 1
        return self.page_number
    