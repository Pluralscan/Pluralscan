from enum import Enum, unique


@unique
class IssueSeverity(Enum):
    """Describes how severe an issue is."""

    UNKNOWN = "unknown"

    HIDDEN = "hidden"
    """
    Something that is an issue, as determined by some authority,
    but is not surfaced through normal means.
    There may be different mechanisms that act on these issues.
    """

    INFO = "info"
    """Information that does not indicate a problem."""

    WARNING = "warning"
    """Something suspicious but allowed."""

    ERROR = "error"
    """Something not allowed by the rules of the language or other authority."""

    @staticmethod
    def from_string(code: str) -> "IssueSeverity":
        """Map string to IssueSeverity."""
        if code.lower() in ["hidden"]:
            return IssueSeverity.HIDDEN
        if code.lower() in ["warning"]:
            return IssueSeverity.WARNING
        if code.lower() in ["info"]:
            return IssueSeverity.INFO
        return IssueSeverity.UNKNOWN
