from django.db import models


class Task(models.Model):
    """Task/checklist item for a client project."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed', 'Completed'
        ON_HOLD = 'on_hold', 'On Hold'

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high', 'High'

    class Category(models.TextChoices):
        SEO = 'seo', 'SEO'
        CONTENT = 'content', 'Content'
        TECHNICAL = 'technical', 'Technical'
        DESIGN = 'design', 'Design'
        DEVELOPMENT = 'development', 'Development'
        REPORTING = 'reporting', 'Reporting'
        OTHER = 'other', 'Other'

    client = models.ForeignKey(
        'clients.ClientProfile',
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM
    )
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER
    )

    due_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)

    # Ordering within client tasks
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-priority', 'due_date']

    def __str__(self):
        return f"{self.title} - {self.client.company_name}"

    @property
    def is_overdue(self):
        """Check if task is overdue."""
        from django.utils import timezone
        if self.status == self.Status.COMPLETED:
            return False
        if not self.due_date:
            return False
        return self.due_date < timezone.now().date()
