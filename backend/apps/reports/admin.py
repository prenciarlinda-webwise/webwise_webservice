from django.contrib import admin
from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'client', 'report_type', 'report_date',
        'file_name', 'uploaded_by', 'created_at'
    ]
    list_filter = ['report_type', 'report_date', 'created_at']
    search_fields = ['title', 'client__company_name', 'description']
    raw_id_fields = ['client', 'uploaded_by']
    ordering = ['-report_date', '-created_at']
