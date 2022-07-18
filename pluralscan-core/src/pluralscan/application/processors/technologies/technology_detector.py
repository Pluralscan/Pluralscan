from abc import abstractmethod

from pluralscan.domain.technologies.technology import Technology


class AbstractTechnologyDetector:
    """AbstractTechnologyDetector"""

    @abstractmethod
    def detect(self, data: any) -> Technology:
        """detect"""
        raise NotImplementedError
