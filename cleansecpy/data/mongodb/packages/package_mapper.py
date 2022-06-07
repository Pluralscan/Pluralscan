from cleansecpy.data.mongodb.packages.package_document import PackageDocument
from cleansecpy.domain.package.package import Package


class PackageMapper:
    """PackageMapper"""

    @staticmethod
    def to_document(package: Package) -> PackageDocument:
        """to_document"""
        return PackageDocument()

    @staticmethod
    def from_document(document: PackageDocument) -> Package:
        """from_document"""
        if document is None:
            return None
        return Package()
