# Views & Viewsets

## APIView

```python
urlpatterns = [
    path("analyzers/", AnalyzerListView.as_view()),
    path("analyzers/<int:pk>", AnalyzerListView.as_view()),
]
```
### ListAPIView

```python
class AnalyzerListView(ListAPIView):
    """AnalyzersView"""
    permission_classes = [AllowAny]
    serializer_class = AnalyzerSerializer

    def get_queryset(self):
        """get_queryset"""
        command = ListAnalyzerCommand()
        result = list_analyzers_use_case().handle(command)
        return result.analyzers
```

## ViewSet

### API Routing

##### Registration

### GenericViewSet
```python
class AnalyzerViewSet(GenericViewSet):
    """AnalyzersView"""
    permission_classes = [AllowAny]
    serializer_class = AnalyzerSerializer

    def get_queryset(self):
        """get_queryset"""
        command = ListAnalyzerCommand()
        result = list_analyzers_use_case().handle(command)
        return result.analyzers
```