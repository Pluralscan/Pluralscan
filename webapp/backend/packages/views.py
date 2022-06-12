from rest_framework.viewsets import GenericViewSet
from rest_framework.permissions import AllowAny
from rest_framework.mixins import ListModelMixin
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from cleansecpy.application.usecases.package.list_packages_use_case import ListPackagesCommand
from .serializers import PackageSerializer
from .factories import get_remote_package_info_use_case, list_packages_use_case


class PackageViewSet(ListModelMixin, GenericViewSet):
    """AnalyzersView"""

    permission_classes = [AllowAny]
    serializer_class = PackageSerializer

    def get_queryset(self):
        """get_queryset"""
        command = ListPackagesCommand()
        result = list_packages_use_case().handle(command)
        return result.packages

    @action(detail=False, methods=["get"])
    def git_package_info(self, request: Request):
        
        return Response({"status": "password set"})
