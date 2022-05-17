from dataclasses import dataclass

from pymongo import MongoClient


@dataclass
class MongoRepositoryOptions:
    """Repository options."""
    client: MongoClient
    database_name: str
    collection_name: str
