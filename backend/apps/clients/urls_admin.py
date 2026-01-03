from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminClientViewSet

router = DefaultRouter()
router.register(r'clients', AdminClientViewSet, basename='admin-clients')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', AdminClientViewSet.as_view({'get': 'stats'}), name='dashboard-stats'),
]
