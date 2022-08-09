from enum import Enum, unique


@unique
class ScanState(Enum):
    """Scan State"""
    SCHEDULED = 'Scheduled'
    PAUSED = 'Paused'
    RUNNING = 'Running'
    PROCESSING = "Processing"
    COMPLETED = 'Completed'
    CANCELLED = 'Cancelled'
    ERROR = 'Error'
