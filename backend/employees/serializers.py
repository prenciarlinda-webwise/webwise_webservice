from rest_framework import serializers
from .models import EmployeeProfile, TaskLog


class EmployeeProfileSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'user', 'user_name', 'user_email',
            'category', 'category_display', 'hourly_rate', 'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and getattr(request.user, 'role', None) != 'admin':
            data.pop('hourly_rate', None)
        return data


class TaskLogSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=EmployeeProfile.objects.all(), required=False)
    description = serializers.CharField(required=False, allow_blank=True, default='')
    employee_name = serializers.CharField(source='employee.user.get_full_name', read_only=True)
    client_name = serializers.CharField(source='client.business_name', read_only=True, default=None)
    deliverable_title = serializers.CharField(source='deliverable.title', read_only=True, default=None)
    cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = TaskLog
        fields = [
            'id', 'employee', 'employee_name', 'client', 'client_name',
            'deliverable', 'deliverable_title',
            'description', 'hours', 'date',
            'document_link', 'live_link',
            'cost', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        deliverable = attrs.get('deliverable') or (self.instance and self.instance.deliverable)
        if not deliverable:
            description = attrs.get('description', '').strip()
            doc_link = attrs.get('document_link', '').strip()
            live_link = attrs.get('live_link', '').strip()
            if not description:
                raise serializers.ValidationError({'description': 'Description is required for extra work not linked to a deliverable.'})
            if not doc_link and not live_link:
                raise serializers.ValidationError('Extra work requires a document link or live link as proof.')
        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and getattr(request.user, 'role', None) != 'admin':
            data.pop('cost', None)
        return data
