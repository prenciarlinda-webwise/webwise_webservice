from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminPlanViewSet

router = DefaultRouter()
router.register(r'plans', AdminPlanViewSet, basename='admin-plans')

urlpatterns = [
    path('', include(router.urls)),
]
