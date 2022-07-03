
import io
from pluralscan.application.usecases.projects.create_project import CreateProjectCommand
from pluralscan.application.usecases.projects.find_project_by_uri import (
    FindProjectByUriQuery,
)
from pluralscan.application.usecases.projects.get_project_list import (
    GetProjectListQuery,
)
from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
import rest_framework.status as status

from ..settings import SOURCES_DIR

from .factories import find_project_by_uri, get_project_list, create_project
from .serializers import ProjectSerializer, PackageSerializer


class ProjectViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    """ProjectViewSet"""

    permission_classes = [AllowAny]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        """get_queryset"""
        query = GetProjectListQuery()
        result = get_project_list().handle(query)
        return result.projects

    def create(self, request, *args, **kwargs):
        try:
            command = CreateProjectCommand(
                uri=request.data["uri"], working_directory=SOURCES_DIR
            )
            result = create_project().handle(command)
            project_serializer: ProjectSerializer = self.get_serializer(result.project)

            package_serializer = PackageSerializer(data=result.package.__dict__)
            package_serializer.is_valid()

            return Response(
                {"project": project_serializer.data, "package": package_serializer.data}
            )
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=["get"],
        url_path=r"uri/(?P<url>[-_a-zA-Z0-9.:/?]+)",
        url_name="uri",
    )
    def find_by_uri(self, _: Request, url=None):
        """find_by_uri"""
        try:
            query = FindProjectByUriQuery(url)
            result = find_project_by_uri().handle(query)
            if result.project is None:
                return Response(status=status.HTTP_204_NO_CONTENT)
            serializer: ProjectSerializer = self.get_serializer(result)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
