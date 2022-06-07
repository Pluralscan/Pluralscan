from abc import ABCMeta, abstractmethod
from cleansecpy.application.usecases.rules.queries.get_rules_request import GetRulesRequest
from cleansecpy.application.usecases.rules.results.get_rules_result import GetRulesResult


class AbstractGetRulesUseCase(metaclass=ABCMeta):
    """AbstractGetRulesUseCase"""
    @abstractmethod
    def handle(self, request: GetRulesRequest) -> GetRulesResult:
        """handle"""
        raise NotImplementedError


class GetRulesUseCase(AbstractGetRulesUseCase):
    """GetRulesUseCase"""

    def handle(self, request: GetRulesRequest) -> GetRulesResult:
        """handle"""
        raise NotImplementedError
