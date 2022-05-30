from dataclasses import dataclass, field
from datetime import datetime

from cleansecpy.domain.package.package_id import PackageId



@dataclass
class Package:
    """Package entity."""
    package_id: PackageId = None
    name:str = None
    description: str = None
    origin: str = None
    manager: str = None
    created_on: datetime = field(default_factory=datetime.now)
    location: str = None
