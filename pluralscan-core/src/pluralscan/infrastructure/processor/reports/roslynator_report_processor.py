import os
import xml.etree.ElementTree as ET
from typing import List

from pluralscan.application.processors.reports.report_processor import (
    AbstractReportProcessor,
)
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.diagnosis.issues.issue import Issue
from pluralscan.domain.diagnosis.issues.issue_location import IssueLocation
from pluralscan.domain.analyzers.rules.rule_id import RuleId
from pluralscan.domain.diagnosis.issues.issue_severity import IssueSeverity


class RoslynatorReportProcessor(AbstractReportProcessor):
    """RoslynatorReportProcessor"""

    def transform_to_diagnosis(self, analyzer_id: AnalyzerId, data) -> Diagnosis:
        """transform_to_diagnosys"""
        report_path = self._validate_input(data)
        issues = self._read_report(report_path, analyzer_id)
        diagnosis = Diagnosis(
            issues=issues,
            report=DiagnosisReport(filename=report_path, format="XML", path=report_path),
        )
        return diagnosis

    @classmethod
    def _read_report(cls, path, analyzer_id) -> List[Issue]:
        """read_report"""
        issues: List[Issue] = []

        if cls._is_empty_file(path):
            return issues

        tree = ET.parse(path)
        root = tree.getroot()

        for item in root.findall("./CodeAnalysis/Projects/Project/Diagnostics/Diagnostic"):
            rule_id = item.attrib["Id"]
            message = item.findtext("Message") or ""
            severity = item.findtext("Severity") or ""
            issues.append(
                Issue(
                    rule_id=RuleId(rule_id, analyzer_id),
                    message=message,
                    severity=IssueSeverity.from_string(severity),
                    location=IssueLocation(
                        path=item.findtext("FilePath"),
                        line=int(item.find("Location").attrib["Line"]),
                        column=int(item.find("Location").attrib["Character"])
                    ),
                )
            )

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

    @classmethod
    def _is_empty_file(cls, path) -> bool:
        return os.path.isfile(path) and os.path.getsize(path) == 0
