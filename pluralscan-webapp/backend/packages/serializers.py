from rest_framework import serializers


class PackageSerializer(serializers.Serializer):
    """Package Serializer."""
    package_id = serializers.CharField()
    name = serializers.CharField()
