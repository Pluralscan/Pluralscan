from dataclasses import dataclass


@dataclass
class DiagnosisReport:
    """Diagnosis report value object."""

    filename: str
    format: str
    path: str
