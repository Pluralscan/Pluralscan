from datetime import datetime
from typing import Any, List, Tuple


class DataclassUtils:
    @staticmethod
    def datetimes_as_string_factory(data: List[Tuple[str, Any]]):
        return {
            field: value.strftime("%m/%d/%Y, %H:%M:%S") if isinstance(value, datetime) else value
            for field, value in data
        }
