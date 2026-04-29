from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CompetitorViewSet

router = DefaultRouter()
router.register(r"competitors", CompetitorViewSet, basename="competitor")

urlpatterns = [
    path("projects/<slug:project_slug>/", include(router.urls)),
]
