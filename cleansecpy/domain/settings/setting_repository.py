from abc import ABCMeta, abstractmethod

from cleansecpy.domain.settings.setting import Setting

class AbstractSettingRepository(metaclass=ABCMeta):
    """Abstract Setting repository."""
    def __del__(self):
        print(f"[!]  Garbage AbstractSettingRepository -> {self.__class__.__name__}")

    @abstractmethod
    def find_by_key(self, key: str) -> Setting:
        """find_by_key"""
        raise NotImplementedError()
