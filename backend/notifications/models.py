from django.db import models
from django.conf import settings


class Notification(models.Model):
    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    class Category(models.TextChoices):
        PHOTO_LOW = 'photo_low', 'Low on Photos'
        REVIEW_REQUEST = 'review_request', 'Review Request'
        DEADLINE = 'deadline', 'Deadline Alert'
        CLIENT_ACTION = 'client_action', 'Client Action Needed'
        GENERAL = 'general', 'General'

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='sent_notifications',
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='received_notifications',
    )
    project = models.ForeignKey(
        'clients.Business', on_delete=models.CASCADE,
        null=True, blank=True, related_name='notifications',
    )
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.GENERAL)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    title = models.CharField(max_length=300)
    message = models.TextField()
    link = models.URLField(blank=True, help_text='Related URL (draft, live page, drive folder, etc.)')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.sender} → {self.recipient}: {self.title}'
