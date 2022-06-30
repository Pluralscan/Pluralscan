from pluralscan.application.processors.jobs.job_runner import AbstractJobRunner
from pluralscan.infrastructure.workers.scan_package_job import \
    ScanPackageWorker
from redis import Redis
from rq import Queue


class RqJobRunner(AbstractJobRunner):
    """RqJobRunner"""

    def schedule(self, job_id: str) -> bool:
        queue = Queue(connection=Redis())
        result = queue.enqueue(ScanPackageWorker.run, job_id)
        return result.is_queued
