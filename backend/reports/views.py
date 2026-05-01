from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsSupervisor

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
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot upload reports.')
        # Auto-fill engagement (project) FK if caller passed only business.
        if not serializer.validated_data.get('project'):
            from clients.models import Project
            biz = serializer.validated_data.get('business')
            if biz is not None:
                default_project = (
                    Project.objects.filter(business=biz, status='active').order_by('id').first()
                    or Project.objects.filter(business=biz).order_by('id').first()
                )
                if default_project:
                    serializer.validated_data['project'] = default_project
        serializer.save(uploaded_by=self.request.user)


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot modify reports.')
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role == 'client':
            raise PermissionDenied('Clients cannot delete reports.')
        instance.delete()

    def get_queryset(self):
        if self.request.user.role in ('admin', 'employee'):
            return Report.objects.all()
        return Report.objects.filter(client__user=self.request.user)


def _metrics_queryset(model, request):
    """Shared queryset logic: admin sees all, client sees own businesses only."""
    if request.user.role in ('admin', 'employee'):
        qs = model.objects.all()
    else:
        qs = model.objects.filter(business__client__user=request.user)
    # Accept both ?business= (preferred) and ?project= (legacy) for transition.
    business = request.query_params.get('business') or request.query_params.get('project')
    if business:
        qs = qs.filter(business_id=business)
    return qs.select_related('business')


def _check_write_permission(request):
    if request.user.role == 'client':
        raise PermissionDenied('Clients cannot modify metrics.')


# --- GBP Metrics ---

class GBPMetricsListCreateView(generics.ListCreateAPIView):
    serializer_class = GBPMetricsSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return _metrics_queryset(GBPMetrics, self.request)

    def perform_create(self, serializer):
        _check_write_permission(self.request)
        serializer.save()


class GBPMetricsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GBPMetricsSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return _metrics_queryset(GBPMetrics, self.request)

    def perform_update(self, serializer):
        _check_write_permission(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        _check_write_permission(self.request)
        instance.delete()


# --- GA4 Metrics ---

class GA4MetricsListCreateView(generics.ListCreateAPIView):
    serializer_class = GA4MetricsSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return _metrics_queryset(GA4Metrics, self.request)

    def perform_create(self, serializer):
        _check_write_permission(self.request)
        serializer.save()


class GA4MetricsDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GA4MetricsSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return _metrics_queryset(GA4Metrics, self.request)

    def perform_update(self, serializer):
        _check_write_permission(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        _check_write_permission(self.request)
        instance.delete()


# --- Search Terms ---

class SearchTermListCreateView(generics.ListCreateAPIView):
    serializer_class = SearchTermSnapshotSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        qs = _metrics_queryset(SearchTermSnapshot, self.request)
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        source = self.request.query_params.get('source')
        if source:
            qs = qs.filter(source=source)
        return qs

    def perform_create(self, serializer):
        _check_write_permission(self.request)
        serializer.save()


class SearchTermDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SearchTermSnapshotSerializer
    permission_classes = [IsSupervisor]

    def get_queryset(self):
        return _metrics_queryset(SearchTermSnapshot, self.request)

    def perform_update(self, serializer):
        _check_write_permission(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        _check_write_permission(self.request)
        instance.delete()
