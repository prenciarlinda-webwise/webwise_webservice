from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientPaymentViewSet

router = DefaultRouter()
router.register(r'payments', ClientPaymentViewSet, basename='client-payments')

urlpatterns = [
    path('', include(router.urls)),
]
