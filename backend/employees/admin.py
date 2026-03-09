from django.contrib import admin
from .models import EmployeeProfile, TaskLog


@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'hourly_rate', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']


@admin.register(TaskLog)
class TaskLogAdmin(admin.ModelAdmin):
    list_display = ['employee', 'client', 'description', 'hours', 'date']
    list_filter = ['date', 'employee']
    search_fields = ['description', 'employee__user__first_name', 'client__business_name']
    date_hierarchy = 'date'
