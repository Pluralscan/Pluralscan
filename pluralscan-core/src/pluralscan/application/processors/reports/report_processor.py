from abc import ABCMeta, abstractmethod
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId

from pluralscan.domain.diagnosis.diagnosis import Diagnosis


class AbstractReportProcessor(metaclass=ABCMeta):
    """
    The responsability of a report processor is to extract pertinent data
    from an analyzer outputs and transform them into a 'Diagnosis' entity.
    """

    @abstractmethod
    def transform_to_diagnosis(self, analyzer_id: AnalyzerId, data) -> Diagnosis:
        """Serialize raw data into 'Diagnosis' entity."""
        raise NotImplementedError

class AbstractReportProcessorFactory(metaclass=ABCMeta):
    """AbstractReportProcessorFactory"""

    @abstractmethod
    def create(self, output_format: str) -> AbstractReportProcessor:
        """create"""
        raise NotImplementedError
