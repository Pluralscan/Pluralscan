from pluralscan.application.processors.reports.report_processor import (
    AbstractReportProcessor,
    AbstractReportProcessorFactory,
)
from pluralscan.infrastructure.processor.reports.roslynator_report_processor import RoslynatorReportProcessor
from pluralscan.infrastructure.processor.reports.sarif_report_processor import (
    SarifReportProcessor,
)


class ReportProcessorFactory(AbstractReportProcessorFactory):
    """Factory of report processor."""

    def create(self, output_format: str) -> AbstractReportProcessor:
        """Create a process runner according to executable type."""
        if output_format == "SARIF":
            return SarifReportProcessor()
        if output_format == 'Roslynator':
            return RoslynatorReportProcessor()

        raise NotImplementedError
