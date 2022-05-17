from dataclasses import dataclass, field
from datetime import datetime

from cleansecpy.domain.package.package_id import PackageId



@dataclass
class Package:
    """Package entity."""
    package_id: PackageId
    description: str = ""
    created_on: datetime = field(default_factory=datetime.now)
