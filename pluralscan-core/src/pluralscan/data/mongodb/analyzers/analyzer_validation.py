import json
import os
from collections import OrderedDict

from pluralscan.data.mongodb.options import MongoRepositoryOptions


class AnalyzerRepositoryValidation:
    """AnalyzerRepositoryValidation"""
    def __init__(self, options: MongoRepositoryOptions):
        self._default_file = os.path.join(
            os.path.dirname(__file__), "validation_command.json")
        self._database = options.client[options.database_name]
        self._collection_name = options.collection_name

    def read_validation_command(self, json_file: str = None) -> OrderedDict:
        """Read MongoDB validation command from json file and return an ordered dictionary."""
        json_file = json_file if json_file is not None else self._default_file
        with open(json_file, 'r') as file:
            rules = json.loads(file.read())
        rules['collMod'] = self._collection_name
        return OrderedDict(rules)

    def execute_on_existing_collection(self, json_file: str = None):
        """Update validation rules for an existing collection."""
        validation_command = self.read_validation_command(json_file)
        return self._database.command(validation_command)
