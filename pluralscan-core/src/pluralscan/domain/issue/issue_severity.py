from enum import Enum, unique


@unique
class IssueSeverity(str, Enum):
    """Describes how severe an issue is."""

    HIDDEN = "Hidden"
    """
    Something that is an issue, as determined by some authority, 
    but is not surfaced through normal means.
    There may be different mechanisms that act on these issues.
    """

    INFO = "Info"
    """Information that does not indicate a problem."""

    WARNING = "Warning"
    """Something suspicious but allowed."""

    ERROR = "Error"
    """Something not allowed by the rules of the language or other authority."""
