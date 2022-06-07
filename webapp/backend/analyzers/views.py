from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from cleansecpy.application.usecases.analyzer.list_analysers_use_case import (
    ListAnalyzerCommand,
)
from .serializers import AnalyzerSerializer
from .factories import list_analyzers_use_case


class AnalyzerListView(ListAPIView):
    """AnalyzersView"""
    permission_classes = [AllowAny]
    serializer_class = AnalyzerSerializer

    def get_queryset(self):
        """get_queryset"""
        command = ListAnalyzerCommand()
        result = list_analyzers_use_case().handle(command)
        return result.analyzers