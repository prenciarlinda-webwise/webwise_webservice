from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Report, GBPMetrics, GA4Metrics, SearchTermSnapshot
from .serializers import ReportSerializer, GBPMetricsSerializer, GA4MetricsSerializer, SearchTermSnapshotSerializer
from accounts.permissions import IsAdmin


class ReportListCreateView(generics.ListCreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            qs = Report.objects.all()
        else:
            qs = Report.objects.filter(client__user=self.request.user)
        client = self.request.query_params.get('client')
        if client:
            qs = qs.filter(client_id=client)
        plan = self.request.query_params.get('monthly_plan')
        if plan:
            qs = qs.filter(monthly_plan_id=plan)
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        return qs.select_related('client', 'uploaded_by')

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            return Report.objects.all()
        return Report.objects.filter(client__user=self.request.user)


# --- GBP Metrics ---

class GBPMetricsListCreateView(generics.ListCreateAPIView):
    serializer_class = GBPMetricsSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = GBPMetrics.objects.all()
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        return qs.select_related('project')


class GBPMetricsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GBPMetricsSerializer
    permission_classes = [IsAdmin]
    queryset = GBPMetrics.objects.all()


# --- GA4 Metrics ---

class GA4MetricsListCreateView(generics.ListCreateAPIView):
    serializer_class = GA4MetricsSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = GA4Metrics.objects.all()
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        return qs.select_related('project')


class GA4MetricsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GA4MetricsSerializer
    permission_classes = [IsAdmin]
    queryset = GA4Metrics.objects.all()


# --- Search Terms ---

class SearchTermListCreateView(generics.ListCreateAPIView):
    serializer_class = SearchTermSnapshotSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = SearchTermSnapshot.objects.all()
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        source = self.request.query_params.get('source')
        if source:
            qs = qs.filter(source=source)
        return qs.select_related('project')


class SearchTermDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SearchTermSnapshotSerializer
    permission_classes = [IsAdmin]
    queryset = SearchTermSnapshot.objects.all()
