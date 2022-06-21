from dataclasses import dataclass


@dataclass
class DiagnosysReport:
    """Diagnosys report value object."""

    filename: str
    format: str
    path: str
