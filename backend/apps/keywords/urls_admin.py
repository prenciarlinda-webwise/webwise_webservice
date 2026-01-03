from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminKeywordViewSet

router = DefaultRouter()
router.register(r'keywords', AdminKeywordViewSet, basename='admin-keywords')

urlpatterns = [
    path('', include(router.urls)),
]
