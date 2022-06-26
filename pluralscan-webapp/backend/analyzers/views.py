from pluralscan.application.usecases.analyzer.list_analysers_use_case import \
    ListAnalyzersCommand
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from .factories import list_analyzers_use_case
from .serializers import AnalyzerSerializer


class AnalyzerViewSet(ListModelMixin, GenericViewSet):
    """AnalyzersView"""

    permission_classes = [AllowAny]
    serializer_class = AnalyzerSerializer

    def get_queryset(self):
        """get_queryset"""
        command = ListAnalyzersCommand()
        result = list_analyzers_use_case().handle(command)
        return result.analyzers
