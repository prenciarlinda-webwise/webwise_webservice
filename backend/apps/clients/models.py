from django.db import models
from django.conf import settings


class ClientProfile(models.Model):
    """Client profile linked to a user account."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='client_profile'
    )
    company_name = models.CharField(max_length=255)
    website_url = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True, help_text='Admin-only notes')

    # Subscription
    plan = models.ForeignKey(
        'plans.Plan',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clients'
    )
    subscription_start_date = models.DateField(null=True, blank=True)
    subscription_end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.company_name

    @property
    def subscription_status(self):
        """Get subscription status."""
        from django.utils import timezone
        today = timezone.now().date()

        if not self.plan:
            return 'no_plan'
        if not self.subscription_end_date:
            return 'active'
        if self.subscription_end_date < today:
            return 'expired'
        return 'active'
