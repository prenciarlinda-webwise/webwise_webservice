from django.contrib import admin
from .models import (
    ClientProfile, Project, ProjectService, MonthlyPlan, Deliverable,
    ServiceTemplate, TemplateDeliverable,
)


class ProjectInline(admin.TabularInline):
    model = Project
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


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'business_email', 'business_phone', 'created_at']
    search_fields = ['business_name', 'user__email', 'user__first_name', 'user__last_name']
    inlines = [ProjectInline]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'status', 'website_url', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'client__business_name']
    inlines = [ProjectServiceInline]


@admin.register(ProjectService)
class ProjectServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'project', 'monthly_price', 'status', 'created_at']
    list_filter = ['status']


@admin.register(MonthlyPlan)
class MonthlyPlanAdmin(admin.ModelAdmin):
    list_display = ['project_service', 'month', 'status']
    list_filter = ['status', 'month']
    inlines = [DeliverableInline]


@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'monthly_plan', 'status', 'assigned_to', 'due_date']
    list_filter = ['category', 'status']
    search_fields = ['title', 'monthly_plan__project_service__project__client__business_name']


@admin.register(ServiceTemplate)
class ServiceTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    inlines = [TemplateDeliverableInline]
