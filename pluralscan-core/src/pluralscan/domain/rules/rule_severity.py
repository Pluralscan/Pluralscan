from enum import Enum, unique


@unique
class RuleSeverity(str, Enum):
    """Rule Action"""

    NONE = "None"
    """Do not check or report."""

    HIDDEN = 'Hidden'
    """May check, but do not report."""

    DEFAULT = "Default"
    """Inherit default action."""

    INFO = "Info"
    """Report as Informational"""

    WARNING = "Warning"
    """Report as Warning."""

    ERROR = "Error"
    """Report as Error."""
