from dataclasses import dataclass


@dataclass(frozen=True)
class Sourcestorage:
    """Stores line and column information of a source code storage."""
    start: int
    end: int

    def __repr__(self) -> str:
        return f'Ln {self.start}, Col {self.end}'


@dataclass(frozen=True)
class Textstorage:
    """Stores character start and end positions of a text file."""
    start: int
    end: int

    def __repr__(self) -> str:
        return f'Ln {self.start}, Col {self.end} ( chars)'
