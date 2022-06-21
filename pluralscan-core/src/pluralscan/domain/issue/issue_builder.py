# Builder Contract
from abc import ABCMeta, abstractmethod
from pluralscan.domain.issue.issue import Issue

from pluralscan.domain.issue.issue_location import IssueLocation


class AbstractIssueBuilder(metaclass=ABCMeta):
    """This interface specificies methods for creating an infractioon."""

    @property
    @abstractmethod
    def breach(self) -> None:
        """Constructor."""
        raise NotImplementedError

    @abstractmethod
    def with_location(self, location: IssueLocation) -> None:
        """With breach location."""
        raise NotImplementedError


# Concrete Builder
class IssueBuilder(AbstractIssueBuilder):
    """Concrete Breach Builder"""

    def __init__(self):
        self.reset()

    def reset(self) -> None:
        """Reset current builder."""
        self._breach = Issue(None, None, False, None)

    @property
    def breach(self) -> Issue:
        breach = self._breach
        # Make builder ready to produce a new breach.
        self.reset()
        return breach

    def with_location(self, location: IssueLocation):
        self.breach.location = location
        return self
