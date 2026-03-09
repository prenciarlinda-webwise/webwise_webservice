from rest_framework import serializers
from .models import Report, GBPMetrics, GA4Metrics, SearchTermSnapshot


class GBPMetricsSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = GBPMetrics
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class GA4MetricsSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = GA4Metrics
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SearchTermSnapshotSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = SearchTermSnapshot
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class ReportSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.business_name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'client', 'client_name', 'project', 'monthly_plan', 'title', 'pdf', 'uploaded_by', 'uploaded_by_name', 'created_at']
        read_only_fields = ['id', 'uploaded_by', 'created_at']
