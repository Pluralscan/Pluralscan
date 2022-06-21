from typing import Dict
from rest_framework import serializers

class EnumValueField(serializers.Field):
    labels = {}
    inverted_labels = {}

    def __init__(self, labels: Dict, *args, **kwargs):
        self.labels = labels
        # Check to make sure the labels dict is reversible, otherwise
        # deserialization may produce unpredictable results
        inverted = {}
        for k, v in labels.items():
            if v in inverted:
                raise ValueError(
                    'The field is not deserializable with the given labels.'
                    ' Please ensure that labels map 1:1 with values'
                )
            inverted[v] = k
        self.inverted_labels = inverted
        super(EnumValueField, self).__init__(*args, **kwargs)

    def to_representation(self, obj):
        return self.labels.get(obj.name, None)

    def to_internal_value(self, data):
        return self.inverted_labels.get(data.name, None)

class ExecutableSerializer(serializers.Serializer):
    """ExecutableSerializer"""

    platform = EnumValueField(labels={'WIN':'Windows'})
    name = serializers.CharField()
    location = serializers.CharField()
    version = serializers.CharField()
    semantic_version = serializers.CharField()

class AnalyzerSerializer(serializers.Serializer):
    """AnalyzerSerializer"""

    id = serializers.CharField(source="analyzer_id")
    name = serializers.CharField()
    executables = ExecutableSerializer(many=True)
