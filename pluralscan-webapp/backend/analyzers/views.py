from pluralscan.application.usecases.analyzers.get_analyzer_list import (
    GetAnalyzerListQuery,
)
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .factories import get_analyzer_list_use_case
from .serializers import AnalyzerSerializer


class AnalyzerViewSet(ListCreateAPIView):
    """AnalyzersView"""

    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        command = GetAnalyzerListQuery()
        result = get_analyzer_list_use_case().handle(command)
        analyzer_serializer = AnalyzerSerializer(data=result.analyzers, many=True)
        analyzer_serializer.is_valid()
        return Response(
            {
                "analyzers": analyzer_serializer.data,
                "totalItems": result.total_items,
                "pageNumber": result.page_number,
                "pageSize": result.page_size,
            }
        )
