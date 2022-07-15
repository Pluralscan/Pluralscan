from typing import Optional

from fastapi import APIRouter, Depends, Response, status
from fastapi.responses import JSONResponse
from factories.package_factory import (
    get_latest_snapshot_use_case,
    get_package_by_id_use_case,
    get_package_list_use_case,
)
from pluralscan.application.usecases.packages.get_latest_snapshot import (
    AbstractGetLatestSnapshotUseCase,
)
from pluralscan.application.usecases.packages.get_package_by_id import (
    AbstractGetPackageByIdUseCase,
)

from pluralscan.application.usecases.packages.get_package_list import (
    GetPackageListQuery,
    GetPackageListUseCase,
)
from pluralscan.domain.packages.package_id import PackageId
from pluralscan.domain.projects.project_id import ProjectId


PACKAGE_ROUTER = APIRouter(prefix="/api/packages", tags=["package"])


@PACKAGE_ROUTER.get("", response_class=JSONResponse)
def index(
    page: Optional[int] = 0,
    limit: Optional[int] = 100,
    usecase: GetPackageListUseCase = Depends(get_package_list_use_case),
):
    """_summary_"""
    query = GetPackageListQuery(page, limit)
    result = usecase.handle(query)
    return {
        "packages": [package.to_dict() for package in result.packages],
        "totalItems": result.total_items,
        "pageNumber": result.page_number,
        "totalPage": result.total_page,
        "pageSize": result.page_size,
    }


@PACKAGE_ROUTER.get("/{package_id}", response_class=JSONResponse)
def get_by_id(
    package_id: str,
    usecase: AbstractGetPackageByIdUseCase = Depends(get_package_by_id_use_case),
):
    """_summary_"""
    result = usecase.handle(PackageId(package_id))
    if result.package is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return {"package": result.package.to_dict()}


@PACKAGE_ROUTER.get("/{project_id}/packages/latest", response_class=JSONResponse)
def latest_snapshot(
    project_id: str,
    usecase: AbstractGetLatestSnapshotUseCase = Depends(get_latest_snapshot_use_case),
):
    """_summary_"""
    result = usecase.handle(ProjectId(project_id))
    if result.package is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return {"package": result.package.to_dict()}
