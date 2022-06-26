import uuid
from typing import Dict, List

from pluralscan.domain.executable.executable import Executable
from pluralscan.domain.executable.executable_id import ExecutableId
from pluralscan.domain.executable.executable_repository import \
    AbstractExecutableRepository
from pluralscan.domain.executable.executable_specification import \
    ExecutablesSpecification


class InMemoryExecutableRepository(AbstractExecutableRepository):
    """
    Type: Concrete Repository\n
    Provide an In Memory DAO for persist executables.\n
    WARNING: The data will be lost on application shutdown.
    """

    def __init__(self):
        self._executables: Dict[ExecutableId, Executable] = {}

    def next_id(self) -> ExecutableId:
        return ExecutableId(uuid.uuid4())

    def find(self, specification: ExecutablesSpecification) -> List[Executable]:
        executables = []
        for executable in self._executables.values():
            if specification.is_satisfied_by(executable):
                executables.append(executable)
        return executables

    def find_by_id(self, executable_id: ExecutableId) -> Executable:
        return self._executables.get(executable_id)

    def find_by_analyzer(self, analyzer_id: str) -> List[Executable]:
        executables = []
        for executable in self._executables.values():
            if repr(executable.analyzer_id) == analyzer_id:
                executables.append(executable)
        return executables

    def get_all(self) -> List[Executable]:
        return list(self._executables.values())

    def update(self, executable: Executable) -> Executable:
        executable = self.find_by_id(executable.executable_id)

        if executable is None:
            raise Exception

        self._executables[executable.executable_id] = executable

        return executable

    def add(self, executable: Executable) -> Executable:
        if executable.executable_id is None:
            str_uuid = str(uuid.uuid4())
            executable.executable_id = str_uuid

        self._executables[executable.executable_id] = executable

        return executable

    def remove(self, executable_id: ExecutableId):
        executable = self.find_by_id(executable_id)

        if executable is None:
            raise Exception

        self._executables.pop(executable_id)

    def count(self) -> int:
        return len(self._executables.items())
