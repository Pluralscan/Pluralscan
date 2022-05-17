from dataclasses import dataclass
from datetime import datetime

from cleansecpy.domain.package.package_id import PackageId
from cleansecpy.domain.source.source import Source
from cleansecpy.domain.source.source_collection import SourceCollection



@dataclass
class Package:
    """Package entity."""
    package_id: PackageId
    path: str = None
    name: str = ''
    url: str = ''
    description: str = None
    sources: SourceCollection = None
    created_on: datetime = None

    def add_source(self, source: Source):
        self.sources.append(source)
