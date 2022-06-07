from django.urls import path
from .views import AnalyzerListView

urlpatterns = [
    path("analyzers/", AnalyzerListView.as_view()),
    path("analyzers/<int:pk>", AnalyzerListView.as_view()),
]
