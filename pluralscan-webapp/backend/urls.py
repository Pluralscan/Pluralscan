"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework import routers

from backend.analyzers.views import (
    AnalyzersList,
    AnalyzerTechnologies,
)  # pylint: disable=import-error
from backend.authentication import views  # pylint: disable=import-error
from backend.packages.views import PackageViewSet  # pylint: disable=import-error
from backend.projects.views import ProjectViewSet  # pylint: disable=import-error

# from backend.scans.views import \
#     ScanViewSet  # pylint: disable=import-error
from backend.spa.views import SpaView  # pylint: disable=import-error

router = routers.DefaultRouter()
router.trailing_slash = ""
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)

# Order matters
urlpatterns = [
    path("api/analyzers", AnalyzersList.as_view(), name="analyzers"),
    path(
        "api/analyzers/technologies",
        AnalyzerTechnologies.as_view(),
        name="analyzer-technologies",
    ),
    path("api/projects", ProjectViewSet.as_view(), name="projects"),
    path("api/packages", PackageViewSet.as_view(), name="packages"),
    path("api/", include(router.urls)),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("admin/", admin.site.urls),
    re_path(r"^.*$", SpaView.as_view(), name="spa"),
]
