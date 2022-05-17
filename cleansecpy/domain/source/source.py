from dataclasses import dataclass
from cleansecpy.domain.source.source_id import SourceId
from cleansecpy.domain.technology.language import Language

from cleansecpy.domain.package.package_id import PackageId


@dataclass
class Source:
    """Source"""

    source_id: SourceId
    package_id: PackageId
    name: str
    path: str
    langage: Language = Language.UNKNOWN
