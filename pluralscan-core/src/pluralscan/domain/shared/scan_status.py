from enum import Enum, unique


@unique
class ScanStatus(Enum):
    """Status of a scan task."""
    SCHEDULED = 'Scheduled'
    PAUSED = 'Paused'
    RUNNING = 'Running'
    PROCESSING = "Processing"
    COMPLETED = 'Completed'
    CANCELLED = 'Cancelled'
    ERROR = 'Error'
