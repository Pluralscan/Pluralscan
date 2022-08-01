from dataclasses import asdict, dataclass, field
from datetime import datetime
from typing import List, Optional

from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.packages.package_link import PackageLink
from pluralscan.domain.packages.package_system import PackageSystem
from pluralscan.domain.projects.project_id import ProjectId
from pluralscan.domain.shared.technology import Technology


@dataclass
class Package:
    """Package entity."""

    package_id: PackageId
    name: str
    version: str
    system: PackageSystem
    """The dependency management system of the package-version."""
    storage_path: str
    published_at: datetime
    author: Optional[str] = None
    licenses: List[str] = field(default_factory=list)
    project_id: Optional[ProjectId] = None
    description: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)
    technologies: List[Technology] = field(default_factory=list)
    links: List[PackageLink] = field(default_factory=list)

    def to_dict(self):
        """Transform entity object into dictonary representation."""
        return {
            "id": repr(self.package_id),
            "name": self.name,
            "author": self.author,
            "licenses": self.licenses,
            "version": self.version,
            "system": self.system.name,
            "storagePath": self.storage_path,
            "publishedAt": self.published_at.strftime("%m/%d/%Y, %H:%M:%S"),
            "projectId": repr(self.project_id),
            "description": self.description,
            "createdAt": self.created_at,
            "technologies": [asdict(x) for x in self.technologies],
        }
