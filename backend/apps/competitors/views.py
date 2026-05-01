from rest_framework import viewsets
from accounts.permissions import IsSupervisor

from clients.models import Business

from .models import Competitor
from .serializers import CompetitorSerializer


class CompetitorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSupervisor]
    serializer_class = CompetitorSerializer
    search_fields = ["domain", "name"]

    def get_queryset(self):
        return Competitor.objects.filter(business__slug=self.kwargs["business_slug"])

    def perform_create(self, serializer):
        project = Business.objects.get(slug=self.kwargs["business_slug"])
        serializer.save(business=project)
