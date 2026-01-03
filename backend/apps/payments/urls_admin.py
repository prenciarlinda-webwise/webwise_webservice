from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminPaymentViewSet, AdminPaymentMethodViewSet

router = DefaultRouter()
router.register(r'payments', AdminPaymentViewSet, basename='admin-payments')
router.register(r'payment-methods', AdminPaymentMethodViewSet, basename='admin-payment-methods')

urlpatterns = [
    path('', include(router.urls)),
]
