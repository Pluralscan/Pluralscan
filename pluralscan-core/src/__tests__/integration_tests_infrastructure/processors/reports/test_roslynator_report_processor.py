from pathlib import Path
from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.infrastructure.processor.reports.roslynator_report_processor import \
    RoslynatorReportProcessor


def test_transform_to_diagnosys():
    path = Path.joinpath(Path(__file__).parent, "fixtures/RoslynatorResults.txt")
    processor = RoslynatorReportProcessor()

    diagnosis = processor.transform_to_diagnosis(AnalyzerId("Test"), [path])

    assert diagnosis is not None

def test_read_report():
    path = Path.joinpath(Path(__file__).parent, "fixtures/RoslynatorResults.txt")
    processor = RoslynatorReportProcessor()

    issues = processor.read_report(path)

    assert issues is not None
