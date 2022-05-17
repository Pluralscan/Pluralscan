from dataclasses import dataclass


@dataclass
class FileSystem:
    """FileSystem Aggregate Root"""
    root_path: str
