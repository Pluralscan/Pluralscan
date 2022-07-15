from rest_framework import serializers

class LanguageSerializer(serializers.Serializer):
    code = serializers.CharField()
    display_name = serializers.CharField()

class CompilerSerializer(serializers.Serializer):
    name = serializers.CharField()
    version = serializers.CharField()
    #extensions = serializers.ListField()
    config_files = serializers.ListField()

class TechnologySerializer(serializers.Serializer):
    code = serializers.CharField()
    display_name = serializers.CharField()
    languages = LanguageSerializer(many=True)
    #compilers = CompilerSerializer(many=True)

class PackageSerializer(serializers.Serializer):
    """Package Serializer."""
    id = serializers.CharField(source="package_id")
    name = serializers.CharField(required=False)
    version = serializers.CharField(required=False)
    registry = serializers.ReadOnlyField(source='registry.name')
    storage_path = serializers.CharField(required=False)
    published_at = serializers.DateTimeField(required=False)
    #project_id = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)
    technologies = TechnologySerializer(many=True)
