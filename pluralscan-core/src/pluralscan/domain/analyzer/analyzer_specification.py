from typing import List

from pluralscan.libs.ddd.specification import AbstractSpecification


class AnalyzerQueryFilter():
    ids: List[str]

class AnalyzerSpecification(AbstractSpecification):
    def __init__(self) -> None:
        super().__init__()

    def is_satisfied_by(self, candidate: any) -> bool:
        return super().is_satisfied_by(candidate)
