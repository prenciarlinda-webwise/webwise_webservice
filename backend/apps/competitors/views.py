from rest_framework import viewsets

from clients.models import Project

from .models import Competitor
from .serializers import CompetitorSerializer


class CompetitorViewSet(viewsets.ModelViewSet):
    serializer_class = CompetitorSerializer
    search_fields = ["domain", "name"]

    def get_queryset(self):
        return Competitor.objects.filter(project__slug=self.kwargs["project_slug"])

    def perform_create(self, serializer):
        project = Project.objects.get(slug=self.kwargs["project_slug"])
        serializer.save(project=project)
