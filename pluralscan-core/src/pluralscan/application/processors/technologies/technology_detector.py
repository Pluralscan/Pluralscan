from abc import abstractmethod
from typing import Any

from pluralscan.domain.shared.technology import Technology


class AbstractTechnologyDetector:
    """AbstractTechnologyDetector"""

    @abstractmethod
    def detect(self, data: Any) -> Technology:
        """detect"""
        raise NotImplementedError
