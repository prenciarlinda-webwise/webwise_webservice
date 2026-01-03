from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminTaskViewSet

router = DefaultRouter()
router.register(r'tasks', AdminTaskViewSet, basename='admin-tasks')

urlpatterns = [
    path('', include(router.urls)),
]
