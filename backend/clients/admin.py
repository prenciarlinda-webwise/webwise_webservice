from django.contrib import admin
from .models import (
    ClientProfile, Business, Project, ProjectService, MonthlyPlan, Deliverable,
    ServiceTemplate, TemplateDeliverable,
    QuarterlyPlan, Location,
)


class ProjectInline(admin.TabularInline):
    model = Business
    extra = 0
    show_change_link = True


class ProjectServiceInline(admin.TabularInline):
    model = ProjectService
    extra = 0


class DeliverableInline(admin.TabularInline):
    model = Deliverable
    extra = 0
    fields = ['sort_order', 'category', 'title', 'status', 'assigned_to', 'link', 'live_url', 'due_date', 'completed_date']


class TemplateDeliverableInline(admin.TabularInline):
    model = TemplateDeliverable
    extra = 0
    fields = ['sort_order', 'category', 'title', 'description', 'frequency', 'quantity', 'week_due']


class MonthlyPlanInline(admin.TabularInline):
    model = MonthlyPlan
    extra = 0
    show_change_link = True
    fields = ['project_service', 'month', 'status']


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'business_email', 'business_phone', 'created_at']
    search_fields = ['business_name', 'user__email', 'user__first_name', 'user__last_name']
    inlines = [ProjectInline]


@admin.register(Business)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'status', 'domain', 'is_seo_tracked', 'website_url', 'created_at']
    list_filter = ['status', 'track_organic', 'track_maps', 'discovery_enabled']
    search_fields = ['name', 'domain', 'client__business_name', 'google_place_id']
    readonly_fields = ['slug', 'is_seo_tracked', 'created_at', 'updated_at']
    fieldsets = (
        (None, {
            'fields': ('client', 'name', 'slug', 'status', 'industry', 'notes'),
        }),
        ('Contact / NAP', {
            'fields': (
                'business_phone', 'business_email', 'business_address',
                'city', 'state', 'zip_code', 'country',
                'business_hours',
            ),
        }),
        ('Web presence', {
            'fields': (
                'website_url', 'domain',
                'google_business_url', 'google_business_name', 'google_place_id', 'google_cid',
                'facebook_url', 'instagram_url',
            ),
        }),
        ('SEO targeting (DataForSEO)', {
            'fields': (
                'location_code', 'location_name', 'language_code',
                'track_organic', 'track_mobile', 'track_maps',
                'discovery_enabled', 'max_discovery_keywords',
                'is_seo_tracked',
            ),
        }),
        ('Internal links / assets', {
            'classes': ('collapse',),
            'fields': ('google_drive_url', 'image_folder_url', 'citations_url', 'booking_url'),
        }),
        ('Business intel', {
            'classes': ('collapse',),
            'fields': (
                'service_areas', 'target_audience', 'competitors', 'usps',
                'marketing_channels', 'nap_status', 'tags',
            ),
        }),
        ('Contract', {
            'classes': ('collapse',),
            'fields': ('monthly_budget_usd', 'contract_start_date', 'contract_end_date'),
        }),
        ('Timestamps', {
            'classes': ('collapse',),
            'fields': ('created_at', 'updated_at'),
        }),
    )
    inlines = [ProjectServiceInline]


@admin.register(ProjectService)
class ProjectServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'business', 'project', 'monthly_price', 'status', 'created_at']
    list_filter = ['status']


@admin.register(QuarterlyPlan)
class QuarterlyPlanAdmin(admin.ModelAdmin):
    list_display = ['business', 'project', 'name', 'status', 'quarter_start', 'quarter_end', 'progress_pct']
    list_filter = ['status', 'quarter_start']
    search_fields = ['name', 'business__name', 'business__client__business_name']
    autocomplete_fields = ['business', 'project']
    readonly_fields = ['progress_pct', 'created_by', 'created_at', 'updated_at']
    inlines = [MonthlyPlanInline]


@admin.register(MonthlyPlan)
class MonthlyPlanAdmin(admin.ModelAdmin):
    list_display = ['project_service', 'month', 'status', 'quarterly_plan']
    list_filter = ['status', 'month']
    autocomplete_fields = ['quarterly_plan']
    inlines = [DeliverableInline]


@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'monthly_plan', 'status', 'assigned_to', 'due_date']
    list_filter = ['category', 'status']
    search_fields = ['title', 'monthly_plan__project_service__business__client__business_name']


@admin.register(Project)
class ProjectEngagementAdmin(admin.ModelAdmin):
    list_display = ['business', 'kind', 'slug', 'status', 'start_date', 'end_date', 'monthly_budget_usd']
    list_filter = ['kind', 'status']
    search_fields = ['business__name', 'business__client__business_name', 'name']
    autocomplete_fields = ['business']
    readonly_fields = ['slug', 'created_at', 'updated_at']


@admin.register(ServiceTemplate)
class ServiceTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    inlines = [TemplateDeliverableInline]


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['location_code', 'location_name', 'location_type', 'country_iso_code']
    list_filter = ['location_type', 'country_iso_code']
    search_fields = ['location_name', 'location_code']
