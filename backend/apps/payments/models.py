from django.db import models
import uuid


class AdminPaymentMethod(models.Model):
    """Admin's payment methods that clients can use to send payments."""

    class MethodType(models.TextChoices):
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        PAYPAL = 'paypal', 'PayPal'
        RIA = 'ria', 'Ria Money Transfer'
        MONEYGRAM = 'moneygram', 'MoneyGram'
        WESTERN_UNION = 'western_union', 'Western Union'
        ZELLE = 'zelle', 'Zelle'
        VENMO = 'venmo', 'Venmo'
        OTHER = 'other', 'Other'

    method_type = models.CharField(
        max_length=20,
        choices=MethodType.choices
    )
    name = models.CharField(max_length=100, help_text='Display name for this payment method')
    details = models.TextField(help_text='Payment details (account info, instructions, etc.)')
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Admin Payment Method'
        verbose_name_plural = 'Admin Payment Methods'

    def __str__(self):
        return f"{self.name} ({self.get_method_type_display()})"


class Payment(models.Model):
    """Payment record for a client."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        OVERDUE = 'overdue', 'Overdue'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'

    class PaymentMethod(models.TextChoices):
        CREDIT_CARD = 'credit_card', 'Credit Card'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        PAYPAL = 'paypal', 'PayPal'
        STRIPE = 'stripe', 'Stripe'
        OTHER = 'other', 'Other'

    client = models.ForeignKey(
        'clients.ClientProfile',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    plan = models.ForeignKey(
        'plans.Plan',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        blank=True
    )
    payment_method_used = models.ForeignKey(
        AdminPaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments',
        help_text='The admin payment method client used'
    )
    reference_number = models.CharField(
        max_length=100,
        blank=True,
        help_text='Reference/transaction number provided by client'
    )

    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)

    invoice_number = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True, help_text='Admin notes')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-due_date']

    def __str__(self):
        return f"{self.invoice_number} - {self.client.company_name}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = self.generate_invoice_number()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_invoice_number():
        """Generate a unique invoice number."""
        from django.utils import timezone
        prefix = timezone.now().strftime('%Y%m')
        unique_part = uuid.uuid4().hex[:6].upper()
        return f"INV-{prefix}-{unique_part}"

    @property
    def is_overdue(self):
        """Check if payment is overdue."""
        from django.utils import timezone
        if self.status != self.Status.PENDING:
            return False
        return self.due_date < timezone.now().date()
