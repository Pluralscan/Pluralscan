import os

APP_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))
RESOURCES_DIR = os.path.abspath(os.path.join(PROJECT_ROOT, 'resources'))
SOURCES_DIR = os.path.abspath(os.path.join(RESOURCES_DIR, 'sources'))
TOOLS_DIR = os.path.abspath(os.path.join(APP_DIR, 'tools'))

base_configuration = {
    'APP_DIR': APP_DIR,
    'PROJECT_ROOT': PROJECT_ROOT,
    'RESOURCES_DIR': RESOURCES_DIR,
    'SOURCES_DIR': SOURCES_DIR,
    'TOOLS_DIR': TOOLS_DIR
}

class Config(object):
    """Base configuration."""

    def __init__(self):
        self._config = base_configuration

    def get_property(self, property_name):
        if property_name not in self._config.keys():
            return None
        return self._config[property_name]

    @property
    def resources_dir(self) -> str:
        return self.get_property("RESOURCES_DIR")
    