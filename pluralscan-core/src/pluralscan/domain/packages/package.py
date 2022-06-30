from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_origin import PackageOrigin
from pluralscan.domain.packages.package_type import PackageType
from pluralscan.domain.technologies.language import Language


@dataclass
class Package:
    """Package entity."""

    package_id: PackageId = None
    name: str = None
    description: str = None
    origin: PackageOrigin = None
    url: str = None
    location: str = None
    language: List[Language] = None
    version: str = None
    type: PackageType = None
    created_on: datetime = field(default_factory=datetime.now)
