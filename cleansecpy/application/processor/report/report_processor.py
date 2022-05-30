from abc import ABCMeta, abstractmethod
from cleansecpy.domain.diagnosys.diagnosys import Diagnosys


class AbstractReportProcessor(metaclass=ABCMeta):
    """AbstractReportProcessor"""

    @abstractmethod
    def transform_to_diagnosys(self, data) -> Diagnosys | Exception:
        """Execute a process without output result."""
        raise NotImplementedError
