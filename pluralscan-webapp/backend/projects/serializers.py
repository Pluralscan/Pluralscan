from rest_framework import serializers


class ProjectSerializer(serializers.Serializer):
    """Project Serializer."""
    id = serializers.CharField(source="project_id")
    name = serializers.CharField()
    uri: serializers.CharField()

class PackageSerializer(serializers.Serializer):
    """Package Serializer"""

    id = serializers.CharField(source="package_id")
    name = serializers.CharField()
