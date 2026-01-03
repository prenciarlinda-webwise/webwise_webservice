from django.contrib import admin
from .models import Plan


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'plan_type', 'price', 'is_recurring', 'is_active']
    list_filter = ['plan_type', 'is_recurring', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['price']
