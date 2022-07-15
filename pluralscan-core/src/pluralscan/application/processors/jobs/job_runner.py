from abc import ABCMeta, abstractmethod

# TODO: implement job value object
class AbstractJobRunner(metaclass=ABCMeta):
    """Abstract interactor for handle asynchronous background job."""

    @abstractmethod
    def schedule(self, job_id: str) -> bool:
        """Schedule the specified task id."""
        raise NotImplementedError
