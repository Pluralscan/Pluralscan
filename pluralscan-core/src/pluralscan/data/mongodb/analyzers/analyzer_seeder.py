from bson import ObjectId
from pluralscan.data.mongodb.analyzers.analyzer_document import \
    AnalyzerDocument
from pluralscan.data.mongodb.analyzers.analyzer_validation import \
    AnalyzerRepositoryValidation
from pluralscan.data.mongodb.options import MongoRepositoryOptions
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_platform import \
    ExecutablePlatform


# TODO: Abstract seeder.
class AnalyzerMongoRepositorySeeder:
    """AnalyzerMongoRepositorySeeder"""

    def __init__(self, options: MongoRepositoryOptions):
        self._collection_name = options.collection_name
        self._database = options.client[options.database_name]
        self._validator = AnalyzerRepositoryValidation(options)

    def seed(self):
        """seed"""
        if self._collection_exists():
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
        executables = [
            Executable(
                platform=ExecutablePlatform.WIN,
                name="Roslynator Fork",
                path="/resources/tools/resolynator-fork-0.3.3.0/Roslynator.exe",
                version="0.3.3.0",
                arguments=[]
            ),
            Executable(
                platform=ExecutablePlatform.DOTNET,
                name="Roslynator",
                version="0.3.3.0",
                arguments=['dotnet', 'roslynator']
            ),
            Executable(
                platform=ExecutablePlatform.DOTNET,
                name="Sonar Dotnet",
                version="5.6.0.48455-net5.0",
                arguments=[
                    'dotnet',
                    '/resources/tools/sonar-scanner-msbuild-5.6.0.48455-net5.0/SonarScanner.MSBuild.dll',
                    '[SONAR_ACTION]'
                    '/k:"[SONAR_PROJECT_NAME]"'
                    '/d:sonar.host.url="[SONAR_SERVER_URL]"'
                    '/d:sonar.login="[SONAR_SERVER_TOKEN]"'
                ]
            )
        ]

        self._database[self._collection_name].insert_many([
            AnalyzerDocument(ObjectId(), "Roslynator Fork", executable=executables[0]),
            AnalyzerDocument(ObjectId(), "Roslynator Dotnet", executable=executables[1]),
            AnalyzerDocument(ObjectId(), "Sonar Dotnet", executable=executables[2]),
        ])
