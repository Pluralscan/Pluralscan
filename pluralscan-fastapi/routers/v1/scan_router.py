import asyncio
import json
from typing import List, Optional
from uuid import uuid4
from fastapi import BackgroundTasks, APIRouter, Body, Depends, Request, Response, status
from fastapi.responses import JSONResponse
from sse_starlette import EventSourceResponse
from configs.database import EVENT_SOURCING
from configs.environment import get_environment_variables
from factories.scan_factory import (
    execute_scan_use_case,
    get_scan_by_id_use_case,
    get_scan_list_use_case,
    schedule_scan_use_case,
)
from pluralscan.application.usecases.scans.get_scan_by_id import (
    AbstractGetScanByIdUseCase,
)

from pluralscan.application.usecases.scans.get_scan_list import (
    AbstractGetScanListUseCase,
    GetScanListQuery,
)
from pluralscan.application.usecases.scans.launch_package_scan import (
    AbstractScanPackageUseCase,
    ScanPackageCommand,
)
from pluralscan.application.usecases.scans.schedule_package_scan import (
    AbstractScheduleScanUseCase,
    ScheduleScanCommand,
)
from pluralscan.domain.analyzers.analyzer_id import AnalyzerId
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.scans.scan_id import ScanId
from pluralscan.domain.scans.scan_state import ScanState
from pluralscan.domain.shared.scans.events.scan_updated_event import ScanUpdatedEvent
from pluralscan.libs.ddd.domain_event import AbstractDomainEvent


SCAN_ROUTER = APIRouter(prefix="/api/scans", tags=["scan"])


@SCAN_ROUTER.get("", response_class=JSONResponse)
def index(
    page: Optional[int] = 0,
    limit: Optional[int] = 100,
    usecase: AbstractGetScanListUseCase = Depends(get_scan_list_use_case),
):
    """_summary_"""
    query = GetScanListQuery(page, limit)
    result = usecase.handle(query)
    return {
        "scans": [scan.to_dict() for scan in result.scans],
        "searchMetadata": {
            "itemCount": result.item_count,
            "pageIndex": result.page_index,
            "pageCount": result.page_count,
            "pageSize": result.page_size,
        },
    }


@SCAN_ROUTER.get("/{scan_id}", response_class=JSONResponse)
def get_by_id(
    scan_id: str,
    get_scan_by_id: AbstractGetScanByIdUseCase = Depends(get_scan_by_id_use_case),
):
    """_summary_"""
    result = get_scan_by_id.handle(ScanId(scan_id))
    return result.scan.to_dict()


@SCAN_ROUTER.get("/stream/{scan_id}")
async def stream_by_id(
    scan_id: str,
    request: Request,
    get_scan_by_id: AbstractGetScanByIdUseCase = Depends(get_scan_by_id_use_case),
):
    """stream_by_id"""
    event_source = EVENT_SOURCING
    async def event_generator():
        events_stack: List[AbstractDomainEvent] = []

        async def scan_state_handler(event: AbstractDomainEvent) -> None:
            if event.aggregate_id == scan_id:
                events_stack.append(event)

        event_source.subscribe(ScanUpdatedEvent.__name__, scan_state_handler)

        def dequeue_event():
            if len(events_stack) > 0:
                return events_stack.pop(0)
            return None

        while True:
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break

            # Checks for new messages and return them to client if any
            try:
                event = dequeue_event()

                if event is not None:
                    result = get_scan_by_id.handle(ScanId(event.aggregate_id))
                    yield {
                        "event": "scan_state", 
                        "id": str(uuid4()),
                        "data": json.dumps(
                            result.scan.to_dict(),
                            default={"error": "JSON Serializion Failed"},
                            skipkeys=True,
                        ),
                    }

                    if result.scan.state is ScanState.COMPLETED:
                        break

                await asyncio.sleep(2)
            except Exception as e:
                print(e)
                break

    return EventSourceResponse(event_generator())


@SCAN_ROUTER.post(
    "/schedule/package/{package_id}",
    response_class=JSONResponse,
    status_code=status.HTTP_201_CREATED,
)
def schedule(
    package_id: str,
    background_tasks: BackgroundTasks,
    body: dict = Body(...),
    schedule_usecase: AbstractScheduleScanUseCase = Depends(schedule_scan_use_case),
    execute_usecase: AbstractScanPackageUseCase = Depends(execute_scan_use_case),
):
    """schedule"""
    analyzers = {}
    for k, versions in body["analyzers"].items():
        analyzers[AnalyzerId(k)] = versions

    command = ScheduleScanCommand(
        PackageId(package_id), analyzers, get_environment_variables().REPORTS_DIR
    )
    result = schedule_usecase.handle(command)

    for scan in result.scans:
        background_tasks.add_task(
            execute_usecase.handle, ScanPackageCommand(scan.uuid)
        )

    return {"scans": [scan.to_dict() for scan in result.scans]}
