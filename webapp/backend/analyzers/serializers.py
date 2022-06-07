from rest_framework import serializers

from cleansecpy.domain.analyzer.analyzer_id import AnalyzerId


class AnalyzerSerializer(serializers.Serializer):
    analyzer_id = serializers.CharField()
    name = serializers.CharField()