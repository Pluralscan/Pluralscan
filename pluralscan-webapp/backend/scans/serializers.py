from rest_framework import serializers


class ScanSerializer(serializers.Serializer):
    """Package Serializer."""
    scan_id = serializers.CharField()
    package_id = serializers.CharField()
