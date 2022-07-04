from rest_framework import serializers


class ProjectSerializer(serializers.Serializer):
    """Project Serializer."""
    id = serializers.CharField(source="project_id")
    name = serializers.CharField(required=False)
    source = serializers.CharField(required=False)
    uri = serializers.CharField(required=False)
    last_snapshot = serializers.DateTimeField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)

class PackageSerializer(serializers.Serializer):
    """Package Serializer"""

    id = serializers.CharField(source="package_id")
    name = serializers.CharField()
    version = serializers.CharField()
    registry = serializers.CharField(allow_blank=True)
    storage = serializers.CharField(allow_blank=True)
    published_at = serializers.DateTimeField()
    uri = serializers.CharField(allow_blank=True)
    project_id = serializers.CharField(allow_blank=True)
    description = serializers.CharField(allow_blank=True)
    technologies = serializers.ListField()
    created_at = serializers.DateTimeField()
