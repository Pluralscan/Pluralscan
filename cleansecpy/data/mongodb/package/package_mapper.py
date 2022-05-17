from cleansecpy.data.mongodb.package.package_document import PackageDocument
from cleansecpy.domain.package.package import Package


class PackageMapper():
    @staticmethod
    def to_document(package: Package) -> PackageDocument:
        return PackageDocument()

    def from_document(document: PackageDocument) -> Package:
        if document is None:
            return None
        return Package()