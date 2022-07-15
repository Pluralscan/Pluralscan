import xml.etree.ElementTree as ET
from typing import List

from pluralscan.application.processors.reports.report_processor import \
    AbstractReportProcessor
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.issues.issue import Issue
from pluralscan.domain.rules.rule_id import RuleId


class RoslynatorReportProcessor(AbstractReportProcessor):
    """RoslynatorReportProcessor"""

    def transform_to_diagnosis(self, analyzer_id: AnalyzerId, data) -> Diagnosis:
        """transform_to_diagnosys"""
        report = self._validate_input(data)
        issues = self.read_report(report)
        diagnosis = Diagnosis(
            issues=issues,
            report=DiagnosisReport(filename=report, format="XML", path=report),
        )
        return diagnosis

    @classmethod
    def read_report(cls, path) -> List[Issue]:
        """read_report"""
        tree = ET.parse(path)
        root = tree.getroot()
        issues = []

        for item in root.findall("./CodeAnalysis/Summary/Diagnostic"):
            rule_id = item.attrib["Id"]
            message = item.attrib["Title"]
            issues.append(Issue(rule_id=RuleId(rule_id), message=message, location=""))

        return issues

    @classmethod
    def _validate_input(cls, data) -> str:
        # if not isinstance(data, [str]):
        #    raise ValueError("Invalid input type. An of report files path is expected.")

        if len(data) == 0:
            raise RuntimeError("No reports provided.")

        if len(data) > 1:
            raise RuntimeError(
                "Only one report file can be processed at a time for Roslynator."
            )
        return data[0]
