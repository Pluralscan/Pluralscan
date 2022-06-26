from pathlib import Path


class Config:
    """Config"""

    ROOT_DIR = Path(__file__).parent.parent.parent.parent.parent.absolute()
    RESOURCES_DIR = Path.joinpath(ROOT_DIR, "resources")
    TOOLS_DIR = Path.joinpath(RESOURCES_DIR, "tools")
    SOURCES_DIR = Path.joinpath(RESOURCES_DIR, "sources")
    REPORTS_DIR = Path.joinpath(RESOURCES_DIR, "reports")
