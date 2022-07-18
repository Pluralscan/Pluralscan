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

class ProjectSerializer(serializers.Serializer):
    """Project Serializer."""
    id = serializers.CharField(required=True)
    name = serializers.CharField(required=False)
    namespace = serializers.CharField(required=False)
    source = serializers.CharField(required=False)
    homepage = serializers.CharField(required=False)
    last_snapshot = serializers.DateTimeField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)

class ProjectListSerializer(serializers.Serializer):
    """Project Serializer."""
    id = serializers.ReadOnlyField(source='project_id.identity')
    name = serializers.CharField(required=False)
    namespace = serializers.CharField(required=False)
    source = serializers.ReadOnlyField(required=False, source='source.name')
    homepage = serializers.CharField(required=False)
    last_snapshot = serializers.DateTimeField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)

class PackageSerializer(serializers.Serializer):
    """Package Serializer"""

    id = serializers.CharField(source="package_id")
    name = serializers.CharField(required=False)
    version = serializers.CharField(required=False)
    system = serializers.CharField(required=False)
    storage_path = serializers.CharField(required=False)
    published_at = serializers.DateTimeField(required=False)
    #project_id = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    created_at = serializers.DateTimeField(required=False)
    technologies = TechnologySerializer(many=True)
    #links = serializers.ListField()
