"""Top-level package for CleanSecPy."""
# cleansecpy/__init__.py

__author__ = 'Gromat Luidgi'
__app_name__ = "cleansecpy"
__license__ = 'MIT'
__version__ = "0.0.1"

from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent.absolute()
RESOURCES_DIR = Path.joinpath(ROOT_DIR, 'resources')
TOOLS_DIR = Path.joinpath(RESOURCES_DIR, 'tools')
SOURCES_DIR = Path.joinpath(RESOURCES_DIR, 'sources')
REPORTS_DIR = Path.joinpath(RESOURCES_DIR, 'reports')
