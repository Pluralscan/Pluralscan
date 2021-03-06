
from dataclasses import dataclass


@dataclass(frozen=True)
class Pageable:
    """Pageable"""
    page_number: int = 0
    page_size: int = 15

    def offset(self) -> int:
        """Returns the offset to be taken according to the underlying page and page size."""
        if self.page_number > 0:
            return self.page_number * self.page_size
        else:
            return 0

    def current_page(self) -> int:
        """Returns the page to be returned."""
        return self.page_number
    