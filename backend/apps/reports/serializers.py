from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report model."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'client', 'client_name', 'title', 'report_type',
            'description', 'file_url', 'file_path', 'file_name',
            'file_size', 'report_date', 'uploaded_by', 'uploaded_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at', 'updated_at']


class ReportListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing reports."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'client', 'client_name', 'title', 'report_type',
            'file_name', 'file_size', 'report_date', 'created_at'
        ]


class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a report."""

    class Meta:
        model = Report
        fields = [
            'client', 'title', 'report_type', 'description',
            'file_path', 'file_name', 'file_size', 'report_date'
        ]

    def create(self, validated_data):
        # Set uploaded_by to current user
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class ReportUploadUrlSerializer(serializers.Serializer):
    """Serializer for requesting an upload URL."""
    client_id = serializers.IntegerField()
    file_name = serializers.CharField()
    content_type = serializers.CharField(required=False, default='application/pdf')

    ALLOWED_CONTENT_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
    ]

    ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg']

    def validate_file_name(self, value):
        """Validate file extension."""
        ext = value.split('.')[-1].lower() if '.' in value else ''
        if ext not in self.ALLOWED_EXTENSIONS:
            raise serializers.ValidationError(
                f'File type not allowed. Allowed types: {", ".join(self.ALLOWED_EXTENSIONS)}'
            )
        return value

    def validate_content_type(self, value):
        """Validate content type."""
        if value not in self.ALLOWED_CONTENT_TYPES:
            raise serializers.ValidationError(
                f'Content type not allowed. Allowed types: PDF, Word, Excel, PNG, JPEG'
            )
        return value


class ClientReportSerializer(serializers.ModelSerializer):
    """Serializer for client viewing their own reports."""

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'description',
            'file_name', 'file_size', 'report_date', 'created_at'
        ]
