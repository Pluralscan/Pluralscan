from abc import ABCMeta, abstractmethod

from pluralscan.domain.diagnosis.diagnosis import Diagnosis


class AbstractReportProcessor(metaclass=ABCMeta):
    """
    The responsability of a report processor is to extract pertinent data
    from an analyzer outputs and transform them into a 'Diagnosis' entity.
    """

    @abstractmethod
    def transform_to_diagnosis(self, data) -> Diagnosis:
        """Serialize raw data into 'Diagnosis' entity."""
        raise NotImplementedError
