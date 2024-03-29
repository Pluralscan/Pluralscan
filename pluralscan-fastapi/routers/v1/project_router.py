from typing import Optional

from fastapi import APIRouter, Body, Depends, Response, status
from fastapi.responses import JSONResponse

from factories.project_factory import (
    create_project_use_case,
    find_project_use_case,
    get_project_list_use_case,
)
from pluralscan.application.usecases.projects.create_project import (
    AbstractCreateProjectUseCase,
    CreateProjectCommand,
)
from pluralscan.application.usecases.projects.get_project import (
    AbstractFindProjectUseCase,
    FindProjectQuery,
)
from pluralscan.application.usecases.projects.get_project_list import (
    GetProjectListQuery,
    GetProjectListUseCase,
)

from configs.environment import get_environment_variables

PROJECT_ROUTER = APIRouter(prefix="/api/projects", tags=["project"])


@PROJECT_ROUTER.get("", response_class=JSONResponse)
def index(
    page: Optional[int] = 0,
    limit: Optional[int] = 100,
    usecase: GetProjectListUseCase = Depends(get_project_list_use_case),
):
    """_summary_"""
    query = GetProjectListQuery(page, limit)
    result = usecase.handle(query)
    return {
        "projects": [project.to_dict() for project in result.projects],
        "searchMetadata": {
            "itemCount": result.item_count,
            "pageIndex": result.page_index,
            "pageCount": result.page_count,
            "pageSize": result.page_size,
        }
    }


@PROJECT_ROUTER.get("/{source}/{owner}/{name}", response_class=JSONResponse)
def find_by_id(
    source: str,
    owner: str,
    name: str,
    usecase: AbstractFindProjectUseCase = Depends(find_project_use_case),
):
    """_summary_"""
    query = FindProjectQuery(source, f"{owner}/{name}")
    result = usecase.handle(query)
    if result.project is None:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    return result.project.to_dict()


@PROJECT_ROUTER.post(
    "",
    response_class=JSONResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    body: dict = Body(...),
    usecase: AbstractCreateProjectUseCase = Depends(create_project_use_case),
):
    """_summary_"""
    command = CreateProjectCommand(body["uri"], get_environment_variables().SOURCES_DIR)
    result = usecase.handle(command)
    return {"project": result.project.to_dict(), "package": result.package.to_dict()}
