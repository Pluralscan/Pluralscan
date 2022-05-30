import os
from bson import ObjectId
from cleansecpy.data.mongodb.analyzer.analyzer_document import AnalyzerDocument
from cleansecpy.data.mongodb.analyzer.analyzer_validation import AnalyzerRepositoryValidation
from cleansecpy.data.mongodb.options import MongoRepositoryOptions
from cleansecpy.domain.executable.executable import Executable
from cleansecpy.domain.executable.executable_type import ExecutableType


class AnalyzerRepositorySeeder:
    """AnalyzerRepositorySeeder"""

    def __init__(self, options: MongoRepositoryOptions):
        self._collection_name = options.collection_name
        self._database = options.client[options.database_name]
        self._validator = AnalyzerRepositoryValidation(options)

    def seed(self):
        """seed"""
        if (self._collection_exists()):
            raise Exception()
        self._create_collection_with_validation()
        self._add_documents()

    def reset_and_seed(self):
        """reset_and_seed"""
        self._drop_collection()
        self.seed()

    def _collection_exists(self) -> bool:
        collection_exists = self._collection_name in self._database.list_collection_names()
        return collection_exists

    def _create_collection_with_validation(self):
        self._database.create_collection(self._collection_name)
        self._validator.execute_on_existing_collection()

    def _drop_collection(self):
        self._database[self._collection_name].drop()

    def _add_documents(self):
        output_dir = os.path.abspath("C:\\opt")
        executables = [
            Executable(
                ExecutableType.WIN64_EXE,
                "Roslynator.exe",
                os.path.join(
                    r"C:\\opt\\roslynator.commandline.0.2.0\\tools\\net48", "Roslynator.exe"),
                options=f"analyze --output {output_dir}.20.xml"
            ),
            Executable(
                ExecutableType.WIN64_EXE,
                "Roslynator.exe",
                os.path.join(
                    r"C:\\opt\\roslynator.commandline.0.3.2\\tools\\net48", "Roslynator.exe"),
                options=f"analyze --output {output_dir}.320.xml"
            )
        ]

        self._database[self._collection_name].insert_many([
            AnalyzerDocument(ObjectId(), "roslynator.commandline",
                             "0.2.0", executable=executables[0]),
            AnalyzerDocument(ObjectId(), "roslynator.commandline",
                             "0.3.2", executable=executables[1]),
        ])
