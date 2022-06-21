from dataclasses import dataclass
from datetime import datetime
from bson import SON, ObjectId


@dataclass(frozen=True)
class PackageDocument(SON):
    """PackageDocument"""

    _id: ObjectId = None
    name: str = None
    version: str = None
    url: str = None
    path: str = None
    description: str = None
    created_on: datetime = None
