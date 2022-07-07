from rest_framework import serializers

class LanguageSerializer(serializers.Serializer):
    code = serializers.CharField()
    display_name = serializers.CharField()
    source_extensions = serializers.ListField()

class CompilerSerializer(serializers.Serializer):
    name = serializers.CharField()
    version = serializers.CharField()
    extensions = serializers.ListField()

class TechnologySerializer(serializers.Serializer):
    code = serializers.CharField()
    display_name = serializers.CharField()
    languages = LanguageSerializer(many=True)
    compilers = CompilerSerializer(many=True)

class ExecutableCommandSerializer(serializers.Serializer):
    action = serializers.ReadOnlyField(source='action.name')
    arguments = serializers.ListField()


class ExecutableSerializer(serializers.Serializer):
    """ExecutableSerializer"""

    platform = serializers.ReadOnlyField(source='platform.name')
    name = serializers.CharField()
    path = serializers.CharField()
    version = serializers.CharField()
    semantic_version = serializers.CharField()
    commands = ExecutableCommandSerializer(many=True)
    runner = serializers.ReadOnlyField(source='runner.name')


class AnalyzerSerializer(serializers.Serializer):
    """AnalyzerSerializer"""

    id = serializers.CharField(source="analyzer_id")
    name = serializers.CharField()
    technologies = TechnologySerializer(many=True)
    description = serializers.CharField()
    executables = ExecutableSerializer(many=True)
