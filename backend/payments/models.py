from decimal import Decimal
from django.db import models
from clients.models import ProjectService, Project, MonthlyPlan


class Payment(models.Model):
    class Status(models.TextChoices):
        PLANNED = 'planned', 'Planned'
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
    planned_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='Budgeted/planned amount')
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text='Actual/done amount')
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


class PersonalIncome(models.Model):
    """Personal income sources (salary, owner's draw, freelance, etc.)."""
    class Source(models.TextChoices):
        SALARY = 'salary', 'Salary'
        OWNERS_DRAW = 'owners_draw', "Owner's Draw"
        FREELANCE = 'freelance', 'Freelance'
        OTHER = 'other', 'Other'

    source = models.CharField(max_length=15, choices=Source.choices)
    description = models.CharField(max_length=300, help_text='e.g. "Quanta Core salary", "WebWise monthly draw"')
    planned_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text='Budgeted/planned amount')
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text='Actual/received amount')
    currency = models.CharField(max_length=5, default='LEK')
    date = models.DateField(null=True, blank=True, help_text='Specific date of this income (e.g. 5th of the month)')
    month = models.DateField(help_text='First day of the month this income applies to')
    is_recurring = models.BooleanField(default=True)
    recurring_day = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Day of month for recurring items (e.g. 5 = 5th)')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-month', 'date', 'source']

    def __str__(self):
        return f"{self.description} — {self.amount} {self.currency} ({self.month.strftime('%B %Y')})"


class PersonalExpense(models.Model):
    """Personal monthly expenses tracked in LEK."""
    class Category(models.TextChoices):
        RENT = 'rent', 'Rent'
        UTILITIES = 'utilities', 'Utilities'
        GROCERIES = 'groceries', 'Groceries'
        DINING = 'dining', 'Dining Out'
        DELIVERY = 'delivery', 'Food Delivery'
        TRANSPORT = 'transport', 'Transport'
        GYM = 'gym', 'Gym/Fitness'
        HEALTH = 'health', 'Health/Medical'
        ENTERTAINMENT = 'entertainment', 'Entertainment'
        CLOTHING = 'clothing', 'Clothing'
        SUBSCRIPTIONS = 'subscriptions', 'Subscriptions'
        EDUCATION = 'education', 'Education'
        SAVINGS = 'savings', 'Savings/Investment'
        DEBT = 'debt', 'Debt'
        PERSONAL = 'personal', 'Personal'
        HOME = 'home', 'Home'
        GIFTS = 'gifts', 'Gifts'
        PETS = 'pets', 'Pets'
        TRAVEL = 'travel', 'Travel'
        OTHER = 'other', 'Other'

    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.CharField(max_length=300)
    planned_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text='Budgeted/planned amount')
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text='Actual/paid amount')
    currency = models.CharField(max_length=5, default='LEK')
    date = models.DateField(null=True, blank=True, help_text='Specific date of this expense (e.g. 7th for rent)')
    month = models.DateField(help_text='First day of the month this expense applies to')
    is_recurring = models.BooleanField(default=False, help_text='If true, auto-suggested for future months')
    recurring_day = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Day of month for recurring items (e.g. 7 = 7th)')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-month', 'date', 'category']

    def __str__(self):
        return f"{self.description} — {self.amount} {self.currency} ({self.month.strftime('%B %Y')})"
