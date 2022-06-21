import xml.etree.ElementTree as ET

from typing import Set
from pluralscan.application.processors.reports.report_processor import AbstractReportProcessor
from pluralscan.domain.diagnosys.diagnosys import Diagnosys
from pluralscan.domain.issue.issue import Issue

class RoslynatorReportProcessor(AbstractReportProcessor):
    """WinExeProcessRunner"""

    def transform_to_diagnosys(self, data) -> Diagnosys:
        """transform_to_diagnosys"""
        report = self._validate_input(data)
        issues = self.read_report(report)
        diagnosys = Diagnosys(issues=issues)
        return diagnosys


    @classmethod
    def read_report(cls, path) -> Set[Issue]:
        """read_report"""
        tree = ET.parse(path)
        root = tree.getroot()
        issues = []

        for item in root.findall('./CodeAnalysis/Summary/Diagnostic'):
            rule_id = item.attrib['Id']
            message = item.attrib['Title']
            issues.append(Issue(rule_id=rule_id, message=message))

        return issues

    @classmethod
    def _validate_input(cls, data) -> str:
        #if not isinstance(data, [str]):
        #    raise ValueError("Invalid input type. An of report files path is expected.")

        if len(data) == 0:
            raise RuntimeError("No reports provided.")

        if len(data) > 1:
            raise RuntimeError("Only one report file can be processed at a time for Roslynator.")
        return data[0]
