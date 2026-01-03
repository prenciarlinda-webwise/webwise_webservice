from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientNotificationViewSet

router = DefaultRouter()
router.register(r'notifications', ClientNotificationViewSet, basename='client-notifications')

urlpatterns = [
    path('', include(router.urls)),
]
