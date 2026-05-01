from rest_framework import serializers
from .models import Report, GBPMetrics, GA4Metrics, SearchTermSnapshot


class GBPMetricsSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = GBPMetrics
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class GA4MetricsSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = GA4Metrics
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class SearchTermSnapshotSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source='business.name', read_only=True)

    class Meta:
        model = SearchTermSnapshot
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class ReportSerializer(serializers.ModelSerializer):
    def to_internal_value(self, data):
        # Backwards-compat: old frontend POSTs `project: <id>` meaning the Business.
        if hasattr(data, 'copy'):
            data = data.copy()
        if 'project' in data and 'business' not in data:
            data['business'] = data.pop('project')
        return super().to_internal_value(data)

    client_name = serializers.CharField(source='client.business_name', read_only=True)
    business_name = serializers.CharField(source='business.name', read_only=True)
    business_slug = serializers.CharField(source='business.slug', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'client', 'client_name',
            'business', 'business_name', 'business_slug',
            'project', 'monthly_plan',
            'title', 'pdf', 'uploaded_by', 'uploaded_by_name', 'created_at',
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at']
