from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['client', 'notification_type', 'target_audience', 'title', 'is_read', 'is_acknowledged', 'created_at']
    list_filter = ['notification_type', 'target_audience', 'is_read', 'is_acknowledged']
    search_fields = ['client__company_name', 'title', 'message']
    readonly_fields = ['created_at', 'updated_at']
