from django.db import models
from django.conf import settings


class Report(models.Model):
    """Report uploaded for a client."""

    class ReportType(models.TextChoices):
        MONTHLY_SEO = 'monthly_seo', 'Monthly SEO Report'
        KEYWORD_RANKING = 'keyword_ranking', 'Keyword Ranking Report'
        TRAFFIC_ANALYSIS = 'traffic_analysis', 'Traffic Analysis'
        TECHNICAL_AUDIT = 'technical_audit', 'Technical Audit'
        CUSTOM = 'custom', 'Custom Report'

    client = models.ForeignKey(
        'clients.ClientProfile',
        on_delete=models.CASCADE,
        related_name='reports'
    )
    title = models.CharField(max_length=255)
    report_type = models.CharField(
        max_length=20,
        choices=ReportType.choices,
        default=ReportType.CUSTOM
    )
    description = models.TextField(blank=True)

    # Supabase Storage reference
    file_url = models.URLField(blank=True)
    file_path = models.CharField(max_length=500)
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)

    report_date = models.DateField(help_text='The period this report covers')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_reports'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-report_date', '-created_at']

    def __str__(self):
        return f"{self.client.company_name} - {self.title}"
