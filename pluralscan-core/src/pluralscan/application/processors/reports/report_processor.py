from abc import ABCMeta, abstractmethod
from pluralscan.domain.diagnosys.diagnosys import Diagnosys


class AbstractReportProcessor(metaclass=ABCMeta):
    """
    The responsability of a report processor is to extract pertinent data
    from analyzer outputs and transform them into diagnosys.
    """

    @abstractmethod
    def transform_to_diagnosys(self, data) -> Diagnosys:
        """Execute a process without output result."""
        raise NotImplementedError
