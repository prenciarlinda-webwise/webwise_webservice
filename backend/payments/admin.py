from django.contrib import admin
from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate, PersonalIncome, PersonalExpense


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['project_service', 'amount', 'payment_type', 'status', 'due_date', 'paid_date']
    list_filter = ['status', 'payment_type']
    search_fields = ['project_service__project__client__business_name', 'description']
    date_hierarchy = 'due_date'


@admin.register(ProjectCost)
class ProjectCostAdmin(admin.ModelAdmin):
    list_display = ['project', 'description', 'amount', 'date']
    search_fields = ['project__name', 'description']
    date_hierarchy = 'date'


@admin.register(BusinessExpense)
class BusinessExpenseAdmin(admin.ModelAdmin):
    list_display = ['name', 'amount', 'frequency', 'category', 'is_active']
    list_filter = ['frequency', 'is_active', 'category']


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ['from_currency', 'to_currency', 'rate', 'updated_at']


@admin.register(PersonalIncome)
class PersonalIncomeAdmin(admin.ModelAdmin):
    list_display = ['description', 'source', 'amount', 'currency', 'month', 'is_recurring']
    list_filter = ['source', 'currency', 'is_recurring']
    date_hierarchy = 'month'


@admin.register(PersonalExpense)
class PersonalExpenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'category', 'amount', 'currency', 'month', 'is_recurring']
    list_filter = ['category', 'currency', 'is_recurring']
    date_hierarchy = 'month'
