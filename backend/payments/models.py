from decimal import Decimal
from django.db import models
from clients.models import ProjectService, Project, MonthlyPlan


class Payment(models.Model):
    class Status(models.TextChoices):
        UPCOMING = 'upcoming', 'Upcoming'
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        CANCELLED = 'cancelled', 'Cancelled'

    class Type(models.TextChoices):
        PREDETERMINED = 'predetermined', 'Predetermined'
        CUSTOM = 'custom', 'Custom'

    project_service = models.ForeignKey(ProjectService, on_delete=models.CASCADE, related_name='payments')
    monthly_plan = models.ForeignKey(MonthlyPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=15, choices=Type.choices, default=Type.PREDETERMINED)
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.UPCOMING)
    description = models.CharField(max_length=300, blank=True)
    due_date = models.DateField(null=True, blank=True)
    paid_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_service} — €{self.amount} ({self.status})"

    class Meta:
        ordering = ['-due_date']


class ProjectCost(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='costs')
    description = models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project} — €{self.amount} cost"

    class Meta:
        ordering = ['-date']


class BusinessExpense(models.Model):
    """Recurring or one-off business expenses not tied to a specific project."""
    class Frequency(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        YEARLY = 'yearly', 'Yearly'
        ONE_TIME = 'one_time', 'One-time'

    name = models.CharField(max_length=200, help_text='e.g. "Anthropic API", "Ahrefs", "BrightLocal"')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    frequency = models.CharField(max_length=10, choices=Frequency.choices, default=Frequency.MONTHLY)
    category = models.CharField(max_length=100, blank=True, help_text='e.g. "AI Tools", "SEO Tools", "Link Building"')
    start_date = models.DateField(help_text='When this expense started')
    end_date = models.DateField(null=True, blank=True, help_text='Leave blank if ongoing')
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — ${self.amount}/{self.get_frequency_display()}"

    @property
    def monthly_cost(self):
        if self.frequency == 'yearly':
            return self.amount / 12
        if self.frequency == 'one_time':
            return Decimal('0')
        return self.amount

    class Meta:
        ordering = ['-is_active', 'name']


class ExchangeRate(models.Model):
    """Manual exchange rates for currency conversion (e.g. USD → LEK)."""
    from_currency = models.CharField(max_length=5, default='USD')
    to_currency = models.CharField(max_length=5, default='LEK')
    rate = models.DecimalField(max_digits=12, decimal_places=4, help_text='1 from_currency = X to_currency')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['from_currency', 'to_currency']

    def __str__(self):
        return f"1 {self.from_currency} = {self.rate} {self.to_currency}"
