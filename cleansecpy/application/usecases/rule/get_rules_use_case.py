from dataclasses import dataclass
from abc import ABCMeta, abstractmethod
from tkinter import OFF
from typing import List

from cleansecpy.domain.entities.rule import Rule

# Input
@dataclass
class GetRulesRequest:
    limit: int = 50
    offset: int = 0

# Output
@dataclass
class GetRulesResult:
    rules: List[Rule]

# Contract
class GetRulesUseCaseInterface(metaclass=ABCMeta):
    @abstractmethod
    def handle(self, request: GetRulesRequest) -> GetRulesResult:
        raise NotImplementedError

# Default Implementation
class GetRulesUseCase(GetRulesUseCaseInterface):
    def __init__(self) -> None:
        super().__init__()

    def handle(self, request: GetRulesRequest) -> GetRulesResult:
        return super().handle(request)