from functools import lru_cache
from pathlib import Path
from pydantic import BaseSettings


class EnvironmentSettings(BaseSettings):
    API_VERSION: str = "0.1.0"
    APP_NAME: str = "Pluralscan API"
    DEBUG_MODE: bool = True
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    RESOURCES_DIR: Path = Path.joinpath(Path(BASE_DIR.parent), 'resources')
    PACKAGES_DIR: Path = Path.joinpath(RESOURCES_DIR, 'packages')
    SOURCES_DIR: Path = Path.joinpath(RESOURCES_DIR, 'sources')
    REPORTS_DIR: Path = Path.joinpath(RESOURCES_DIR, 'reports')

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_environment_variables():
    return EnvironmentSettings()
