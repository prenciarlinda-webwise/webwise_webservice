from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notifications for profile changes, offers, and other events."""

    class NotificationType(models.TextChoices):
        PROFILE_CHANGE = 'profile_change', 'Profile Change'
        BUSINESS_CHANGE = 'business_change', 'Business Information Change'
        OFFER = 'offer', 'Special Offer'
        PAYMENT = 'payment', 'Payment Update'
        TASK = 'task', 'Task Update'
        REPORT = 'report', 'New Report'

    class TargetAudience(models.TextChoices):
        CLIENT = 'client', 'Client'
        ADMIN = 'admin', 'Admin'

    client = models.ForeignKey(
        'clients.ClientProfile',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices
    )
    target_audience = models.CharField(
        max_length=10,
        choices=TargetAudience.choices
    )
    title = models.CharField(max_length=255)
    message = models.TextField()

    # For profile changes - store what changed
    changed_fields = models.JSONField(null=True, blank=True)
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)

    # Who made the change
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications_created'
    )

    # Status
    is_read = models.BooleanField(default=False)
    is_acknowledged = models.BooleanField(default=False)
    acknowledged_at = models.DateTimeField(null=True, blank=True)

    # For offers
    offer_details = models.JSONField(null=True, blank=True)
    offer_expires_at = models.DateTimeField(null=True, blank=True)
    offer_accepted = models.BooleanField(null=True, blank=True)
    offer_responded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} for {self.client.company_name}"
