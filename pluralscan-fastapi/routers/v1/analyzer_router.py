from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from factories.analyzer_factory import (
    find_analyzers_by_technologies_use_case,
    get_analyzer_list_use_case,
)
from pluralscan.application.usecases.analyzers.get_analyzers_by_technologies import (
    AbstractFindAnalyzersByTechnologiesUseCase,
    FindAnalyzersByTechnologiesQuery,
)
from pluralscan.application.usecases.analyzers.get_analyzer_list import (
    AbstractGetAnalyzerListUseCase,
    GetAnalyzerListQuery,
)
from pluralscan.domain.shared.technology import Technology


ANALYZER_ROUTER = APIRouter(prefix="/api/analyzers", tags=["analyzer"])


@ANALYZER_ROUTER.get("", response_class=JSONResponse)
def index(
    limit: Optional[int] = 100,
    page: Optional[int] = 0,
    usecase: AbstractGetAnalyzerListUseCase = Depends(get_analyzer_list_use_case),
):
    """_summary_"""
    query = GetAnalyzerListQuery(page, limit)
    result = usecase.handle(query)
    return {
        "analyzers": [analyzer.to_dict() for analyzer in result.analyzers],
        "searchMetadata": {
            "itemCount": result.item_count,
            "pageIndex": result.page_index,
            "pageCount": result.page_count,
            "pageSize": result.page_size,
        }
    }


@ANALYZER_ROUTER.get("/technologies", response_class=JSONResponse)
def find_by_technologies(
    code: List[str] = Query(None),
    usecase: AbstractFindAnalyzersByTechnologiesUseCase = Depends(
        find_analyzers_by_technologies_use_case
    ),
):
    """_summary_"""
    query = FindAnalyzersByTechnologiesQuery(
        [Technology.from_code(tech) for tech in code]
    )
    result = usecase.handle(query)
    return [analyzer.to_dict() for analyzer in result.analyzers]
