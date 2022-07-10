import uuid
from typing import Dict, List

from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_id import DiagnosisId
from pluralscan.domain.diagnosis.diagnosis_repository import \
    AbstractDiagnosisRepository


class InMemoryDiagnosisRepository(AbstractDiagnosisRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist analyzers.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._diagnosis: Dict[str, Diagnosis] = {}

    def next_id(self) -> DiagnosisId:
        return DiagnosisId(uuid.uuid4())

    def get_by_id(self, diagnosis_id: str) -> Diagnosis:
        return self._diagnosis.get(diagnosis_id)

    def find_all(self) -> List[Diagnosis]:
        return list(self._diagnosis.values())

    def update(self, diagnosis: Diagnosis) -> Diagnosis:
        diagnosis = self.get_by_id(diagnosis.diagnosis_id)

        if diagnosis is None:
            raise Exception

        self._diagnosis[diagnosis.diagnosis_id] = diagnosis

        return diagnosis

    def add(self, diagnosis: Diagnosis) -> Diagnosis:
        str_uuid = str(uuid.uuid4())

        if diagnosis.diagnosis_id is None:
            diagnosis.diagnosis_id = str_uuid

        self._diagnosis[diagnosis.diagnosis_id] = diagnosis

        return diagnosis

    def remove(self, diagnosis_id: str):
        diagnosis = self.get_by_id(diagnosis_id)

        if diagnosis is None:
            raise Exception

        self._diagnosis.pop(diagnosis_id)

    def count(self) -> int:
        return len(self._diagnosis.items())
