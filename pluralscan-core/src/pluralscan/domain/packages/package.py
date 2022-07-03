from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_registry import PackageRegistry
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.technologies.technology import Technology


@dataclass
class Package:
    """Package entity."""

    package_id: PackageId
    name: str
    version: str
    registry: PackageRegistry
    storage: str
    published_at: datetime
    uri: Optional[str] = None
    project_id: Optional[ProjectId] = None
    description: Optional[str] = None
    technologies: List[Technology] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)
