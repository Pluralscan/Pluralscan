from dataclasses import dataclass, field
from datetime import datetime

from pluralscan.domain.package.package_id import PackageId
from pluralscan.domain.package.package_origin import PackageOrigin
from pluralscan.domain.package.package_type import PackageType
from pluralscan.domain.technology.language import Language


@dataclass
class Package:
    """Package entity."""

    package_id: PackageId = None
    name: str = None
    description: str = None
    origin: PackageOrigin = None
    language: Language = None
    version: str = None
    type: PackageType = None
    manager: str = None
    created_on: datetime = field(default_factory=datetime.now)
    location: str = None
