from rest_framework import serializers


class PackageSerializer(serializers.Serializer):
    """Package Serializer."""
    id = serializers.CharField(source="package_id")
    name = serializers.CharField()
    version = serializers.CharField()
    registry = serializers.ReadOnlyField(source='registry.name')
    storage_path = serializers.CharField()
    published_at = serializers.DateTimeField()
    uri = serializers.CharField(required=False)
    project_id = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField()
