from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from apps.accounts.permissions import IsAdmin
from .models import Plan
from .serializers import PlanSerializer, PlanListSerializer


class AdminPlanViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing subscription plans."""
    queryset = Plan.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return PlanListSerializer
        return PlanSerializer
