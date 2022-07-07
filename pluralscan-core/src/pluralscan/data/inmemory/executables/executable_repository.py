import uuid
from typing import Dict, List, Optional

from pluralscan.domain.analyzer.analyzer_id import AnalyzerId
from pluralscan.domain.executables.executable import Executable
from pluralscan.domain.executables.executable_id import ExecutableId
from pluralscan.domain.executables.executable_repository import \
    AbstractExecutableRepository


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

    # def find(self, specification: ExecutablesSpecification) -> List[Executable]:
    #     executables = []
    #     for executable in self._executables.values():
    #         if specification.is_satisfied_by(executable):
    #             executables.append(executable)
    #     return executables

    def find_by_id(self, executable_id: ExecutableId) -> Optional[Executable]:
        return self._executables.get(executable_id)

    def find_many(self, executable_ids: List[ExecutableId]) -> List[Executable]:
        return [x for x in self._executables.values() if x.executable_id in executable_ids]

    def find_by_analyzer(self, analyzer_id: AnalyzerId) -> List[Executable]:
        executables = []
        for executable in self._executables.values():
            if executable.analyzer_id == analyzer_id:
                executables.append(executable)
        return executables

    def find_all(self) -> List[Executable]:
        return list(self._executables.values())

    def update(self, executable: Executable) -> Executable:
        _executable = self.find_by_id(ExecutableId(executable.executable_id))

        if _executable is None:
            raise Exception

        self._executables[_executable.executable_id] = _executable

        return _executable

    def add(self, executable: Executable) -> Executable:
        if executable.executable_id is None:
            executable.executable_id = self.next_id()

        self._executables[executable.executable_id] = executable

        return executable

    def remove(self, executable_id: ExecutableId):
        executable = self.find_by_id(executable_id)

        if executable is None:
            raise Exception

        self._executables.pop(executable_id)

    def count(self) -> int:
        return len(self._executables.items())
