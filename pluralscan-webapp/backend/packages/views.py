import re
from pluralscan.application.usecases.packages.get_package_list import GetPackageListQuery

import rest_framework.status as status
from pluralscan.application.processors.fetchers.package_fetcher import \
    AbstractPackageFetcher

from rest_framework.decorators import action
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from .factories import list_packages_use_case
from .serializers import PackageSerializer


class PackageViewSet(ListModelMixin, GenericViewSet):
    """AnalyzersView"""

    permission_classes = [AllowAny]
    serializer_class = PackageSerializer

    def get_queryset(self):
        """get_queryset"""
        command = GetPackageListQuery()
        result = list_packages_use_case().handle(command)
        return result.packages
