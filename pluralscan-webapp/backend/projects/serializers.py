from rest_framework import serializers

class CompilerSerializer(serializers.Serializer):
    name = serializers.CharField()
    version = serializers.CharField()
    extensions = serializers.ListField()

class TechnologySerializer(serializers.Serializer):
    code = serializers.CharField()
    display_name = serializers.CharField()
    source_extensions = serializers.ListField()
    compilers = CompilerSerializer(many=True)

class ProjectSerializer(serializers.Serializer):
    """Project Serializer."""
    id = serializers.CharField(source="project_id")
    name = serializers.CharField(required=True)
    source = serializers.CharField(required=True)
    uri = serializers.CharField(required=False)
    last_snapshot = serializers.DateTimeField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)

class PackageSerializer(serializers.Serializer):
    """Package Serializer"""

    id = serializers.CharField(source="package_id")
    name = serializers.CharField()
    version = serializers.CharField()
    registry = serializers.ReadOnlyField(source='registry.name')
    storage_path = serializers.CharField(required=False)
    published_at = serializers.DateTimeField(required=False)
    uri = serializers.CharField(required=False)
    project_id = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField()
