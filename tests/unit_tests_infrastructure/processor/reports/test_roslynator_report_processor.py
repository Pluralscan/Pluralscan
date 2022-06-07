from cleansecpy.infrastructure.processor.report.roslynator_report_processor import RoslynatorReportProcessor

def test_transform_to_diagnosys():
    path = r"C:\\_dev\\CleanSecPy\\resources\\sources\\AnalyzerTests\\RESULTS\\result.txt"
    processor = RoslynatorReportProcessor()

    diagnosys = processor.transform_to_diagnosys([path])

    assert diagnosys is not None

def test_read_report():
    path = r"C:\\_dev\\CleanSecPy\\resources\\sources\\AnalyzerTests\\RESULTS\\result.txt"
    processor = RoslynatorReportProcessor()

    issues = processor.read_report(path)

    assert issues is not None