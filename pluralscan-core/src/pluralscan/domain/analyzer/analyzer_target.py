from enum import Enum


class AnalyzerTarget(Enum):
    """AnalyzerTarget"""
    PACKAGE = 'package',
    SOURCE = 'source',
    DLL = 'dll',
    DOCKER = 'docker'
