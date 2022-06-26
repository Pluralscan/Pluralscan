from pluralscan.infrastructure.processor.reports.roslynator_report_processor import \
    RoslynatorReportProcessor


def test_transform_to_diagnosys():
    path = r"C:\\_dev\\CleanSecPy\\resources\\sources\\AnalyzerTests\\RESULTS\\result.txt"
    processor = RoslynatorReportProcessor()

    diagnosis = processor.transform_to_diagnosys([path])

    assert diagnosis is not None

def test_read_report():
    path = r"C:\\_dev\\CleanSecPy\\resources\\sources\\AnalyzerTests\\RESULTS\\result.txt"
    processor = RoslynatorReportProcessor()

    issues = processor.read_report(path)

    assert issues is not None