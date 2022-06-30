from pluralscan.application.usecases.analyzers.get_analyzer_list import \
    GetAnalyzerListCommand
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from .factories import get_analyzer_list_use_case
from .serializers import AnalyzerSerializer


class AnalyzerViewSet(ListModelMixin, GenericViewSet):
    """AnalyzersView"""

    permission_classes = [AllowAny]
    serializer_class = AnalyzerSerializer

    def get_queryset(self):
        """get_queryset"""
        command = GetAnalyzerListCommand()
        result = get_analyzer_list_use_case().handle(command)
        return result.analyzers
