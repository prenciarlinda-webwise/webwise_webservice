from django.contrib import admin
from .models import Report, GBPMetrics, GA4Metrics, SearchTermSnapshot


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'project', 'uploaded_by', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'client__business_name']


@admin.register(GBPMetrics)
class GBPMetricsAdmin(admin.ModelAdmin):
    list_display = ['business', 'month', 'total_interactions', 'profile_views', 'calls', 'website_clicks', 'review_count']
    list_filter = ['month', 'business']


@admin.register(GA4Metrics)
class GA4MetricsAdmin(admin.ModelAdmin):
    list_display = ['business', 'month', 'active_users', 'new_users', 'total_sessions', 'page_views', 'phone_clicks', 'estimate_requests']
    list_filter = ['month', 'business']


@admin.register(SearchTermSnapshot)
class SearchTermSnapshotAdmin(admin.ModelAdmin):
    list_display = ['business', 'month', 'source', 'keyword', 'impressions', 'clicks', 'avg_position', 'local_pack']
    list_filter = ['month', 'source', 'business']
    search_fields = ['keyword']
