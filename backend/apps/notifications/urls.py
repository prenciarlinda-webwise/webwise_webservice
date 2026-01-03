from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminNotificationViewSet, ClientNotificationViewSet

router = DefaultRouter()
router.register(r'admin/notifications', AdminNotificationViewSet, basename='admin-notifications')
router.register(r'client/notifications', ClientNotificationViewSet, basename='client-notifications')

urlpatterns = [
    path('', include(router.urls)),
]
