from typing import Optional
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from factories.scan_factory import get_scan_list_use_case

from pluralscan.application.usecases.scans.get_scan_list import (
    GetScanListQuery,
    GetScanListUseCase,
)


SCAN_ROUTER = APIRouter(prefix="/api/scans", tags=["scan"])


@SCAN_ROUTER.get("", response_class=JSONResponse)
def index(
    page: Optional[int] = 0,
    limit: Optional[int] = 100,
    usecase: GetScanListUseCase = Depends(get_scan_list_use_case),
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
