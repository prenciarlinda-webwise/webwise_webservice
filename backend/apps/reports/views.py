from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import models

from apps.accounts.permissions import IsAdmin, IsClient, IsClientOwner
from .models import Report
from .serializers import (
    ReportSerializer,
    ReportListSerializer,
    ReportCreateSerializer,
    ReportUploadUrlSerializer,
    ClientReportSerializer,
)
from .services import storage_service


class AdminReportViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing reports."""
    queryset = Report.objects.select_related('client', 'uploaded_by').all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return ReportListSerializer
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by client
        client_id = self.request.query_params.get('client')
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        # Filter by report type
        report_type = self.request.query_params.get('type')
        if report_type:
            queryset = queryset.filter(report_type=report_type)
        return queryset

    def perform_destroy(self, instance):
        # Delete file from storage
        if storage_service and instance.file_path:
            try:
                storage_service.delete_file(instance.file_path)
            except Exception:
                pass  # File might not exist
        instance.delete()

    @action(detail=False, methods=['post'])
    def upload_url(self, request):
        """Get a signed URL for uploading a report file."""
        serializer = ReportUploadUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not storage_service:
            return Response(
                {'error': 'Storage service not configured'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        client_id = serializer.validated_data['client_id']
        file_name = serializer.validated_data['file_name']

        try:
            file_path = storage_service.generate_file_path(client_id, file_name)
            upload_data = storage_service.get_upload_url(file_path)
            return Response({
                'upload_url': upload_data['signed_url'],
                'file_path': upload_data['path'],
                'token': upload_data.get('token', ''),
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def download_url(self, request, pk=None):
        """Get a signed URL for downloading a report file."""
        report = self.get_object()

        if not storage_service:
            return Response(
                {'error': 'Storage service not configured'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        try:
            download_url = storage_service.get_download_url(report.file_path)
            return Response({'download_url': download_url})
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ClientReportListView(generics.ListAPIView):
    """Client view for listing their own reports."""
    serializer_class = ClientReportSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Report.objects.filter(
            client=self.request.user.client_profile
        ).order_by('-report_date')


class ClientReportDetailView(generics.RetrieveAPIView):
    """Client view for getting report details and download URL."""
    serializer_class = ClientReportSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Report.objects.filter(client=self.request.user.client_profile)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data

        # Add download URL
        if storage_service and instance.file_path:
            try:
                data['download_url'] = storage_service.get_download_url(instance.file_path)
            except Exception:
                data['download_url'] = None

        return Response(data)
