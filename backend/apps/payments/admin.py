from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'invoice_number', 'client', 'amount', 'currency',
        'status', 'due_date', 'paid_date', 'is_overdue'
    ]
    list_filter = ['status', 'payment_method', 'due_date', 'created_at']
    search_fields = ['invoice_number', 'client__company_name', 'description']
    raw_id_fields = ['client', 'plan']
    ordering = ['-due_date']
    date_hierarchy = 'due_date'
