import json
from collections import OrderedDict

from pymongo import MongoClient


class PackageRepositoryValidation:

    def __init__(self, client: MongoClient):
        self._database = client.test
        pass

    def load_validation_command(self, validation_file: str = "validation_command.json") -> OrderedDict:
        with open(validation_file, 'r') as file:
            rules = json.loads(file.read())
        return OrderedDict(rules)

    def execute_on_existing_collection(self):
        validation_command = self.load_validation_command()
        self._database.command(validation_command)
