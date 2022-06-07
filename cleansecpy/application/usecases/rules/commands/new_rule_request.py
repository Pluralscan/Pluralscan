from dataclasses import dataclass

from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId


@dataclass(frozen=True)
class NewRuleRequest:
    """Input Command DTO for NewRuleUseCase."""
    analyzer_id: AnalyzerId
