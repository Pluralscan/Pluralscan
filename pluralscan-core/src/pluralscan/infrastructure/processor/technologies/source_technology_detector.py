from typing import List

from pluralscan.application.processors.technologies.technology_detector import \
    AbstractTechnologyDetector
from pluralscan.domain.shared.technology import Technology


class SourceTechnologyDetector(AbstractTechnologyDetector):
    """SourceTechnologyDetector"""
    def __init__(self, files: List[str]) -> None:
        self._files = files

    def detect(self, data: any) -> Technology:
        return super().detect(data)
