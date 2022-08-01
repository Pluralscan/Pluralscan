# Default Implementation


class ProcessScanReportHandler():  # pylint: disable=too-few-public-methods
    """GetScanByIdUseCase"""

    def __init__(self):
        pass

    def handle(self, event: NewScan) -> None:
        scan = self._scan_repository.find_by_id(scan_id)
        if scan is None:
            raise RuntimeError
        return GetScanByIdResult(scan)