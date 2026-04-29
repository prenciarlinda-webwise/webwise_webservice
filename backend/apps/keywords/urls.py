from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import KeywordViewSet, PagesView

router = DefaultRouter()
router.register(r"keywords", KeywordViewSet, basename="keyword")

urlpatterns = [
    path("projects/<slug:project_slug>/", include(router.urls)),
    path("projects/<slug:project_slug>/pages/", PagesView.as_view(), name="pages"),
]
