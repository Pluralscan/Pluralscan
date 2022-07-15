from typing import List

from sarif import loader
from pluralscan.application.processors.reports.report_processor import (
    AbstractReportProcessor,
)
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.issues.issue_location import IssueLocation
from pluralscan.domain.issues.issue_severity import IssueSeverity
from pluralscan.domain.diagnosis.diagnosis import Diagnosis
from pluralscan.domain.diagnosis.diagnosis_report import DiagnosisReport
from pluralscan.domain.issues.issue import Issue
from pluralscan.domain.rules.rule_id import RuleId


class SarifReportProcessor(AbstractReportProcessor):
    """RoslynatorReportProcessor"""


    def transform_to_diagnosis(self, analyzer_id: AnalyzerId, data) -> Diagnosis:
        """transform_to_diagnosys"""
        report = self._validate_input(data)
        issues = self._read_report(report, analyzer_id)
        diagnosis = Diagnosis(
            issues=issues,
            report=DiagnosisReport(filename=report, format="SARIF", path=report),
        )
        return diagnosis

    def _read_report(self, path, analyzer_id) -> List[Issue]:
        """read_report"""
        sarif_data = loader.load_sarif_file(path)
        issues = []

        for item in sarif_data.get_results():
            rule_id = RuleId(code=item.get("ruleId"), analyzer_id=analyzer_id)
            message = item.get("message")["text"]
            severity = IssueSeverity.from_string(item.get("level"))

            location = IssueLocation(
                path=item.get("locations")[0]["physicalLocation"]["artifactLocation"][
                    "uri"
                ],
                absolute_path=item.get("locations")[0]["logicalLocations"][0][
                    "fullyQualifiedName"
                ],
            )
            issues.append(
                Issue(
                    rule_id=rule_id,
                    message=message,
                    severity=severity,
                    location=location,
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
