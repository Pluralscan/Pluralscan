from pluralscan.application.usecases.packages.get_package_list import (
    GetPackageListQuery,
)

from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.request import Request

from .factories import get_package_list_use_case
from .serializers import PackageSerializer


class PackageViewSet(ListCreateAPIView):
    """AnalyzersView"""

    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        command = GetPackageListQuery(
            int(request.query_params.get("page", 1)),
            int(request.query_params.get("limit", 15)),
        )
        result = get_package_list_use_case().handle(command)
        package_serializer = PackageSerializer(data=result.packages, many=True)
        package_serializer.is_valid()
        return Response(
            {
                "packages": package_serializer.data,
                "totalItems": result.total_items,
                "pageNumber": result.page_number,
                "pageSize": result.page_size,
            }
        )
