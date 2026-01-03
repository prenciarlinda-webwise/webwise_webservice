from django.db import models


class Plan(models.Model):
    """Subscription plan model."""

    class PlanType(models.TextChoices):
        SEO_STARTER = 'seo_starter', 'Starter SEO'
        SEO_MEDIUM = 'seo_medium', 'Medium SEO'
        SEO_PREMIUM = 'seo_premium', 'Premium SEO'
        WEBSITE = 'website', 'Website Development'
        CUSTOM = 'custom', 'Custom'

    name = models.CharField(max_length=100)
    plan_type = models.CharField(
        max_length=20,
        choices=PlanType.choices,
        default=PlanType.CUSTOM
    )
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_recurring = models.BooleanField(default=True)
    features = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return self.name
