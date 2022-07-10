from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_registry import PackageRegistry
from pluralscan.domain.technologies.technology import Technology


@dataclass
class Package:
    """Package entity."""

    package_id: PackageId
    name: str
    version: str
    registry: PackageRegistry
    storage_path: str
    published_at: datetime
    description: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    technologies: List[Technology] = field(default_factory=list)
    links: List[tuple[str, str]] = field(default_factory=list)
