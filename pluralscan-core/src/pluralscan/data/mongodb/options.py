from dataclasses import dataclass

from pymongo import MongoClient


@dataclass
class MongoRepositoryOptions:
    """Common set of options defined for a MongoDB repository."""
    client: MongoClient
    database_name: str
    collection_name: str
