from abc import ABCMeta, abstractmethod

from pluralscan.application.usecases.rules.commands.new_rule_request import \
    NewRuleRequest
from pluralscan.application.usecases.rules.results.new_rule_result import \
    NewRuleResult


class AbstractNewRuleUseCase(metaclass=ABCMeta):
    """AbstractNewRuleUseCase"""
    @abstractmethod
    def handle(self, request: NewRuleRequest) -> NewRuleResult:
        """Handle use case."""
        raise NotImplementedError


class NewRuleUseCase(AbstractNewRuleUseCase):
    """This class contains business logic implementation used to create a new analyzer rule."""
    def __init__(self, rule_repository) -> None:
        self._rule_repository = rule_repository

    def handle(self, request: NewRuleRequest) -> NewRuleResult:
        raise NotImplementedError
