from abc import ABCMeta, abstractmethod
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId

from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_id import DiagnosisId


class AbstractReportProcessor(metaclass=ABCMeta):
    """
    The responsability of a report processor is to extract pertinent data
    from an analyzer outputs and transform them into a 'Diagnosis' entity.
    """

    @abstractmethod
    def transform_to_diagnosis(self, analyzer_id: AnalyzerId, diagnosis_id: DiagnosisId, data) -> Diagnosis:
        """Serialize raw data into 'Diagnosis' entity."""
        raise NotImplementedError
