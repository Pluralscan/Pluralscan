
from pluralscan.application.usecases.projects.create_project import CreateProjectCommand
from pluralscan.application.usecases.projects.find_project import (
    FindProjectQuery,
)
from pluralscan.application.usecases.projects.get_project_list import (
    GetProjectListQuery,
)
from rest_framework.decorators import action
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
import rest_framework.status as status

from ..settings import SOURCES_DIR

from .factories import find_project, get_project_list, create_project
from .serializers import ProjectSerializer, PackageSerializer


class ProjectViewSet(ListCreateAPIView):
    """ProjectViewSet"""

    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        command = GetProjectListQuery(
            int(request.query_params.get("page", 1)),
            int(request.query_params.get("limit", 15)),
        )
        result = get_project_list().handle(command)
        project_serializer = ProjectSerializer(data=result.projects, many=True)
        project_serializer.is_valid()
        return Response(
            {
                "projects": project_serializer.data,
                "totalItems": result.total_items,
                "pageNumber": result.page_number,
                "pageSize": result.page_size,
            }
        )

    def post(self, request, *args, **kwargs):
        try:
            command = CreateProjectCommand(
                uri=request.data["uri"], working_directory=SOURCES_DIR
            )
            result = create_project().handle(command)
            project_serializer: ProjectSerializer = self.get_serializer(result.project)

            package_serializer = PackageSerializer(data=result.package)
            package_serializer.is_valid()

            return Response(
                {"project": project_serializer.data, "package": package_serializer.data}
            )
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=["get"],
        url_path=r"(?P<source>[-_a-zA-Z0-9]+)(/)(?P<name>[-_a-zA-Z0-9.:/%?]+)",
        url_name="find"
    )
    def find_one(self, _: Request, source=None, name=None):
        """find"""
        try:
            query = FindProjectQuery(name, source)
            result = find_project().handle(query)
            if result.project is None:
                return Response(status=status.HTTP_204_NO_CONTENT)
            serializer: ProjectSerializer = self.get_serializer(result.project)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
