import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Set

from pluralscan.application.processors.reports.report_processor import \
    AbstractReportProcessor
from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.issue.issue import Issue
from pluralscan.domain.scans.scan import Scan


class RoslynatorReportProcessor(AbstractReportProcessor):
    """RoslynatorReportProcessor"""

    def transform_to_diagnosis(self, scan: Scan, data) -> Diagnosis:
        """transform_to_diagnosys"""
        report = self._validate_input(data)
        issues = self.read_report(report)
        diagnosis = Diagnosis(
            scan_id=scan.scan_id,
            issues=issues,
            report=DiagnosisReport(filename="", format="XML", path=report),
        )
        return diagnosis

    @classmethod
    def read_report(cls, path) -> Set[Issue]:
        """read_report"""
        tree = ET.parse(path)
        root = tree.getroot()
        issues = []

        for item in root.findall("./CodeAnalysis/Summary/Diagnostic"):
            rule_id = item.attrib["Id"]
            message = item.attrib["Title"]
            issues.append(Issue(rule_id=rule_id, message=message))

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
