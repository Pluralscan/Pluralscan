from enum import Enum


class Lifecycle(Enum):
    """Lifecycle"""

    PRODUCTION = 'production'
    DEVELOPMENT = 'development'
    SANDBOX = 'sandbox'
