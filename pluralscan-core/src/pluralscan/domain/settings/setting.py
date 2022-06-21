from dataclasses import dataclass


@dataclass
class Setting:
    """Setting entity."""

    key: str
    value: str
