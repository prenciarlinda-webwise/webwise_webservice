from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import KeywordViewSet, PagesView

router = DefaultRouter()
router.register(r"keywords", KeywordViewSet, basename="keyword")

urlpatterns = [
    path("businesses/<slug:business_slug>/", include(router.urls)),
    path("businesses/<slug:business_slug>/pages/", PagesView.as_view(), name="pages"),
]
