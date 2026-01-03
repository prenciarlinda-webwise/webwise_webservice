from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'client', 'status', 'priority', 'category', 'due_date', 'is_overdue']
    list_filter = ['status', 'priority', 'category', 'client']
    search_fields = ['title', 'description', 'client__company_name']
    ordering = ['order', '-priority', 'due_date']
