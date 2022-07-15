from pluralscan.application.usecases.analyzers.find_analyzers_by_technologies import (
    FindAnalyzersByTechnologiesQuery,
)
from pluralscan.application.usecases.analyzers.get_analyzer_list import (
    GetAnalyzerListQuery,
)
from pluralscan.domain.technologies.technology import Technology
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status


from .factories import find_analyzers_by_technology_use_case, get_analyzer_list_use_case
from .serializers import AnalyzerSerializer


class AnalyzersList(RetrieveAPIView):
    """AnalyzersView"""

    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        command = GetAnalyzerListQuery(
            int(request.query_params.get("page", 1)),
            int(request.query_params.get("limit", 15)),
        )
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


class AnalyzerTechnologies(RetrieveAPIView):
    """AnalyzerTechnologies"""

    permission_classes = [AllowAny]

    def get(self, request: Request, *args, **kwargs):
        """find"""
        try:
            technologies = [
                Technology.from_code(code)
                for code in request.query_params.getlist("code")
                if Technology.from_code(code) is not None
            ]
            if technologies is None or len(technologies) == 0:
                raise ValueError

            query = FindAnalyzersByTechnologiesQuery(technologies)
            result = find_analyzers_by_technology_use_case().handle(query)
            analyzer_serializer = AnalyzerSerializer(data=result.analyzers, many=True)
            analyzer_serializer.is_valid()
            return Response(
            {
                "analyzers": analyzer_serializer.data,
            })   
        except:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
