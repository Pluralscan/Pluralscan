# Builder Contract
from abc import ABCMeta, abstractmethod

from pluralscan.domain.issues.issue import Issue
from pluralscan.domain.issues.issue_storage import Issuestorage


class AbstractIssueBuilder(metaclass=ABCMeta):
    """This interface specificies methods for creating an infractioon."""

    @property
    @abstractmethod
    def breach(self) -> None:
        """Constructor."""
        raise NotImplementedError

    @abstractmethod
    def with_storage(self, storage: Issuestorage) -> None:
        """With breach storage."""
        raise NotImplementedError


# Concrete Builder
class IssueBuilder(AbstractIssueBuilder):
    """Concrete Issue Builder"""

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

    def with_storage(self, storage: Issuestorage):
        self.breach.storage = storage
        return self
