from dataclasses import dataclass

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId


@dataclass(frozen=True)
class NewRuleRequest:
    """Input Command DTO for NewRuleUseCase."""
    analyzer_id: AnalyzerId
