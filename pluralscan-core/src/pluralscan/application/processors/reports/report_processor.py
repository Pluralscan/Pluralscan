from abc import ABCMeta, abstractmethod

from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.scans.scan import Scan


class AbstractReportProcessor(metaclass=ABCMeta):
    """
    The responsability of a report processor is to extract pertinent data
    from analyzer outputs and transform them into diagnosis.
    """

    @abstractmethod
    def transform_to_diagnosis(self, scan: Scan, data) -> Diagnosis:
        """Serialize raw data into 'Diagnosis' entity."""
        raise NotImplementedError
