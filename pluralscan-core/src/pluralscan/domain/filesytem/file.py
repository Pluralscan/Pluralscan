from dataclasses import dataclass


@dataclass
class File:
    """File entity."""
    name: str
    type: None
    hash: str
    path: str
