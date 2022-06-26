from abc import ABCMeta, abstractmethod


class AbstractJobRunner(metaclass=ABCMeta):
    """Abstract interactor for handle asynchronous background job."""

    @abstractmethod
    def schredule(self, job_id: str) -> bool:
        """Schredule the specified task id."""
        raise NotImplementedError
