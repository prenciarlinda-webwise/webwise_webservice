from django.conf import settings
from django.db import models
from clients.models import ClientProfile


class EmployeeProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='employee_profile')
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username}"


class TaskLog(models.Model):
    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE, related_name='task_logs')
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='task_logs', null=True, blank=True)
    deliverable = models.ForeignKey(
        'clients.Deliverable', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='time_logs',
        help_text='Link to a deliverable. If null, this is extra/unplanned work.',
    )
    description = models.CharField(max_length=500)
    hours = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField()
    # Required for extra (non-deliverable) work
    document_link = models.URLField(blank=True, help_text='Google Drive / draft link')
    live_link = models.URLField(blank=True, help_text='Published / live URL')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.employee} — {self.hours}h — {self.description[:50]}"

    @property
    def cost(self):
        return self.hours * self.employee.hourly_rate

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.deliverable:
            if not self.description.strip():
                raise ValidationError({'description': 'Description is required for extra work.'})
            if not self.document_link and not self.live_link:
                raise ValidationError('Extra work requires at least a document link or live link.')

    class Meta:
        ordering = ['-date']
