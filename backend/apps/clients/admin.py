from django.contrib import admin
from .models import ClientProfile


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = [
        'company_name', 'user', 'plan', 'subscription_status',
        'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'plan', 'created_at']
    search_fields = ['company_name', 'user__email', 'user__first_name', 'user__last_name']
    raw_id_fields = ['user', 'plan']
    ordering = ['-created_at']
