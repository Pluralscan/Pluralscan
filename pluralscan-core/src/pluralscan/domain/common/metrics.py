from dataclasses import dataclass
from pluralscan.domain.common.language import Language

@dataclass(frozen=True)
class ProjectLanguageMetric:
    """ProjectLanguageMetric"""
    language: Language
    percent: int
