from pluralscan.infrastructure.workers.scan_package_job import \
    ScanPackageWorker
from redis import Redis
from rq import Queue, SimpleWorker


def test_execute():
    queue = Queue(is_async=False, connection=Redis())
    job = queue.enqueue(ScanPackageWorker().run, "Test")
    assert job.is_finished
