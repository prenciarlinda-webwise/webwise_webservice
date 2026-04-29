from django.db import models
from rest_framework import serializers
from .models import (
    ClientProfile, Project, ProjectService, MonthlyPlan, Deliverable,
    ServiceTemplate, TemplateDeliverable, BusinessCatalogItem,
    QuarterlyPlan, Location,
)
from reports.models import Report


class BusinessCatalogItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessCatalogItem
        fields = [
            'id', 'project', 'item_type', 'name', 'description',
            'price', 'price_unit', 'duration_days', 'specifications', 'sort_order', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class DeliverableSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True, default=None)
    logged_hours = serializers.SerializerMethodField()

    class Meta:
        model = Deliverable
        fields = [
            'id', 'monthly_plan', 'category', 'category_display', 'title', 'description',
            'target_keyword', 'status', 'status_display', 'frequency', 'quantity',
            'estimated_minutes', 'logged_hours', 'assigned_to', 'assigned_to_name', 'link', 'live_url',
            'start_date', 'due_date', 'completed_date', 'notes', 'sort_order', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_logged_hours(self, obj):
        total = obj.time_logs.aggregate(s=models.Sum('hours'))['s']
        return str(total) if total else None


class PlanReportSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'title', 'pdf', 'uploaded_by_name', 'created_at']
        read_only_fields = ['id', 'created_at']


class MonthlyPlanSerializer(serializers.ModelSerializer):
    deliverables = DeliverableSerializer(many=True, read_only=True)
    reports = PlanReportSerializer(many=True, read_only=True)
    service_name = serializers.CharField(source='project_service.name', read_only=True)
    project_name = serializers.CharField(source='project_service.project.name', read_only=True)
    project_id = serializers.IntegerField(source='project_service.project.id', read_only=True)
    client_name = serializers.CharField(source='project_service.project.client.business_name', read_only=True)
    client_id = serializers.IntegerField(source='project_service.project.client.id', read_only=True)
    month_display = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    total_costs = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    profit_margin = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = MonthlyPlan
        fields = [
            'id', 'project_service', 'service_name', 'project_name', 'project_id', 'client_name', 'client_id',
            'quarterly_plan',
            'month', 'month_display', 'status', 'notes',
            'monthly_retainer', 'content_writer_cost', 'tool_costs', 'link_building_spend', 'other_costs',
            'total_costs', 'profit_margin',
            'progress', 'deliverables', 'reports', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_month_display(self, obj):
        return obj.month.strftime('%B %Y')

    def get_progress(self, obj):
        deliverables = obj.deliverables.all()
        total = deliverables.count()
        if total == 0:
            return {'total': 0, 'completed': 0, 'in_progress': 0, 'not_started': 0, 'percent': 0}
        completed = deliverables.filter(status__in=['completed', 'published']).count()
        in_progress = deliverables.filter(status='in_progress').count()
        return {
            'total': total,
            'completed': completed,
            'in_progress': in_progress,
            'not_started': total - completed - in_progress,
            'percent': round((completed / total) * 100),
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        role = getattr(request.user, 'role', None) if request else None
        financial_fields = ['monthly_retainer', 'content_writer_cost', 'tool_costs', 'link_building_spend', 'other_costs', 'total_costs', 'profit_margin']
        if role == 'employee':
            # Employees only see their own assigned deliverables
            data['deliverables'] = [
                d for d in data['deliverables']
                if d.get('assigned_to') == request.user.id
            ]
            for f in financial_fields:
                data.pop(f, None)
        elif role == 'client':
            for f in financial_fields:
                data.pop(f, None)
        return data


class ProjectServiceSerializer(serializers.ModelSerializer):
    template_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = ProjectService
        fields = ['id', 'project', 'name', 'description', 'monthly_price', 'status', 'template_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data.pop('template_id', None)
        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        role = getattr(request.user, 'role', None) if request else None
        # Only admin sees pricing
        if role in ('employee', 'client'):
            data.pop('monthly_price', None)
        return data


class ProjectServiceDetailSerializer(serializers.ModelSerializer):
    """Service with nested monthly plans and deliverables."""
    monthly_plans = MonthlyPlanSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectService
        fields = ['id', 'project', 'name', 'description', 'monthly_price', 'status', 'monthly_plans', 'created_at']
        read_only_fields = ['id', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        role = getattr(request.user, 'role', None) if request else None
        if role in ('employee', 'client'):
            data.pop('monthly_price', None)
        return data


class ProjectSerializer(serializers.ModelSerializer):
    services = ProjectServiceSerializer(many=True, read_only=True)
    catalog = BusinessCatalogItemSerializer(many=True, read_only=True)
    client = serializers.PrimaryKeyRelatedField(queryset=ClientProfile.objects.all(), required=False)

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'client', 'name', 'business_phone', 'business_email', 'business_address',
            'website_url', 'business_hours', 'service_areas',
            'google_business_url', 'facebook_url', 'instagram_url', 'google_drive_url', 'image_folder_url',
            'citations_url', 'booking_url',
            'industry', 'target_audience', 'competitors', 'usps', 'marketing_channels', 'nap_status',
            # SEO targeting + structured NAP + GBP IDs + tracking flags
            'domain', 'city', 'state', 'zip_code', 'country',
            'google_business_name', 'google_place_id', 'google_cid',
            'location_code', 'location_name', 'language_code',
            'track_organic', 'track_mobile', 'track_maps',
            'discovery_enabled', 'max_discovery_keywords',
            'tags', 'monthly_budget_usd', 'contract_start_date', 'contract_end_date',
            'is_seo_tracked',
            'status', 'notes', 'services', 'catalog', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full project with services → plans → deliverables nested."""
    services = ProjectServiceDetailSerializer(many=True, read_only=True)
    catalog = BusinessCatalogItemSerializer(many=True, read_only=True)
    client_name = serializers.CharField(source='client.business_name', read_only=True)
    client_id = serializers.IntegerField(source='client.id', read_only=True)
    client_slug = serializers.CharField(source='client.slug', read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'client', 'client_name', 'client_id', 'client_slug', 'name',
            'business_phone', 'business_email', 'business_address', 'website_url',
            'business_hours', 'service_areas',
            'google_business_url', 'facebook_url', 'instagram_url', 'google_drive_url', 'image_folder_url',
            'citations_url', 'booking_url',
            'industry', 'target_audience', 'competitors', 'usps', 'marketing_channels', 'nap_status',
            # SEO targeting + structured NAP + GBP IDs + tracking flags
            'domain', 'city', 'state', 'zip_code', 'country',
            'google_business_name', 'google_place_id', 'google_cid',
            'location_code', 'location_name', 'language_code',
            'track_organic', 'track_mobile', 'track_maps',
            'discovery_enabled', 'max_discovery_keywords',
            'tags', 'monthly_budget_usd', 'contract_start_date', 'contract_end_date',
            'is_seo_tracked',
            'status', 'notes', 'services', 'catalog', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class ClientProfileSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_first_name = serializers.CharField(source='user.first_name', read_only=True)
    user_last_name = serializers.CharField(source='user.last_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'slug', 'user', 'user_email', 'user_name',
            'user_first_name', 'user_last_name', 'user_phone',
            'business_name', 'business_phone', 'business_email',
            'services', 'products', 'price_per_service',
            'service_locations', 'social_links', 'notes',
            'projects', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and getattr(request.user, 'role', None) == 'employee':
            # Employees see business info only, NOT client personal contact
            data.pop('user', None)
            data.pop('user_email', None)
            data.pop('user_name', None)
            data.pop('price_per_service', None)
            data.pop('notes', None)
        return data


class TemplateDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplateDeliverable
        fields = ['id', 'template', 'category', 'title', 'description', 'frequency', 'quantity', 'estimated_minutes', 'week_due', 'sort_order']
        read_only_fields = ['id']


class ServiceTemplateSerializer(serializers.ModelSerializer):
    deliverables = TemplateDeliverableSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceTemplate
        fields = ['id', 'name', 'description', 'deliverables', 'created_at']
        read_only_fields = ['id', 'created_at']


# ----- Quarterly plan -----

class QuarterlyPlanSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)
    client_id = serializers.IntegerField(source='project.client.id', read_only=True)
    client_name = serializers.CharField(source='project.client.business_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    progress_pct = serializers.IntegerField(read_only=True)
    monthly_plans_count = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True, default=None)

    class Meta:
        model = QuarterlyPlan
        fields = [
            'id', 'project', 'project_name', 'client_id', 'client_name',
            'name', 'status', 'status_display',
            'quarter_start', 'quarter_end', 'goals', 'notes',
            'progress_pct', 'monthly_plans_count',
            'created_by', 'created_by_name', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']

    def get_monthly_plans_count(self, obj):
        return obj.monthly_plans.count()


# ----- DataForSEO location lookup (read-only picker) -----

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['location_code', 'location_name', 'location_type', 'country_iso_code', 'location_code_parent']
