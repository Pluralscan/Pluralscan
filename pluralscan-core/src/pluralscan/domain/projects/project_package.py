from dataclasses import dataclass
from pluralscan.domain.packages.package_id import PackageId

from pluralscan.domain.projects.project_id import ProjectId


@dataclass
class ProjectPackage:
    """
    ProjectPackage entity represent a relationship
    between the project and package entity.
    """

    project_id: ProjectId
    package_id: PackageId
