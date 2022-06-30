from enum import Enum, unique


@unique
class ScanState(Enum):
    """Scan State"""
    SCHEDULED = 'sheduled'
    RUNNING = 'running'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    ERROR = 'error'
