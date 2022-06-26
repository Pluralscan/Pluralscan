import json
from collections import OrderedDict

from pymongo import MongoClient


class ScanRepositoryValidation:
    """ScanRepositoryValidation"""
    def __init__(self, client: MongoClient):
        self._database = client.test

    def load_validation_command(
        self, validation_file: str = "validation_command.json"
    ) -> OrderedDict:
        """load_validation_command"""
        with open(validation_file, "r") as file:
            rules = json.loads(file.read())
        return OrderedDict(rules)

    def execute_on_existing_collection(self):
        """execute_on_existing_collection"""
        validation_command = self.load_validation_command()
        self._database.command(validation_command)
