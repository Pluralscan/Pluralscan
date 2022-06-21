from dataclasses import dataclass
from bson import SON, ObjectId
from pluralscan.domain.executable.executable import Executable


@dataclass
class AnalyzerDocument(SON):
    """Analyzer mongo document."""
    _id: ObjectId = None
    name: str = None
    executable: Executable = None

    def __post_init__(self):
        self.refresh_son_dict()

    def refresh_son_dict(self):
        """Assign document property to internal SON dictionary."""
        if self._id is not None:
            self.__setitem__('_id', str(self._id))
        if self.name is not None:
            self.__setitem__('name', self.name)
        if self.executable is not None:
            self.__setitem__('executable', SON(self.executable.as_dict()))
