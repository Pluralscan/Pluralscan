from enum import Enum, unique

@unique
class ExecutableType(Enum):
    INTERNAL = 'internal',
    WIN32_EXE = 'win32_exe',
    WIN64_EXE = 'win64.exe'