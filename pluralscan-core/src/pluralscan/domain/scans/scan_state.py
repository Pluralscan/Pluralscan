from enum import Enum, unique


@unique
class ScanState(Enum):
    """Scan State"""
    SCHREDULED = 'shreduled'
    RUNNING = 'running'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    ERROR = 'error'
