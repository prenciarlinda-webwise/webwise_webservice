from django.conf import settings
from django.db import models
from clients.models import ClientProfile, Business, MonthlyPlan


class GBPMetrics(models.Model):
    """Google Business Profile monthly performance snapshot.

    Source of truth is the absolute view counts (`*_views`) and interaction
    counts. Percentages and change-vs-prior-month are *derived* from these so
    they're always exact — no rounding drift.
    """
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='gbp_metrics')
    month = models.DateField(help_text='First day of the month')

    # BrightLocal export ID (the GBP store code). Optional — kept for traceability.
    gbp_store_code = models.CharField(max_length=50, blank=True)

    # ─── Discovery: profile views per platform/device (absolute counts) ───
    # These are the raw numbers from BrightLocal's "Performance Report".
    search_mobile_views = models.IntegerField(default=0)
    search_desktop_views = models.IntegerField(default=0)
    maps_mobile_views = models.IntegerField(default=0)
    maps_desktop_views = models.IntegerField(default=0)

    # Sum of the 4 above. Stored (not @property) so it's queryable and indexable
    # — recomputed in save() / importer.
    profile_views = models.IntegerField(default=0)
    profile_views_change_pct = models.DecimalField(max_digits=8, decimal_places=1, null=True, blank=True)

    # ─── Interactions (absolute counts) ───
    calls = models.IntegerField(default=0)
    chat_clicks = models.IntegerField(default=0)         # GBP "Messages"
    bookings = models.IntegerField(default=0)
    direction_clicks = models.IntegerField(default=0)    # GBP "Directions"
    website_clicks = models.IntegerField(default=0)
    total_interactions = models.IntegerField(default=0)
    interactions_change_pct = models.DecimalField(max_digits=8, decimal_places=1, null=True, blank=True, help_text='% change vs comparison period')

    # ─── Platform breakdown (% of views) — derived from the 4 *_views above ───
    search_desktop_pct = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    search_mobile_pct = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    maps_desktop_pct = models.DecimalField(max_digits=5, decimal_places=1, default=0)
    maps_mobile_pct = models.DecimalField(max_digits=5, decimal_places=1, default=0)

    # ─── Photos, reviews, posts (manual entry — not in BrightLocal performance CSV) ───
    photo_count = models.IntegerField(default=0)
    review_count = models.IntegerField(default=0)
    review_avg_rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    new_reviews = models.IntegerField(default=0)
    posts_published = models.IntegerField(default=0)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['business', 'month']
        ordering = ['-month']
        verbose_name = 'GBP Metrics'
        verbose_name_plural = 'GBP Metrics'

    def __str__(self):
        return f"{self.business.name} — GBP {self.month.strftime('%b %Y')}"

    def save(self, *args, **kwargs):
        # Always recompute derived fields from absolute counts so the table /
        # API never returns stale percentages or sums.
        self.recompute_derived()
        super().save(*args, **kwargs)

    def recompute_derived(self):
        """Recompute profile_views, total_interactions, and the 4 platform %s
        from the absolute counts. Called by the importer after each upsert."""
        from decimal import Decimal, ROUND_HALF_UP

        views = (
            self.search_mobile_views + self.search_desktop_views
            + self.maps_mobile_views + self.maps_desktop_views
        )
        self.profile_views = views
        self.total_interactions = (
            self.calls + self.chat_clicks + self.bookings
            + self.direction_clicks + self.website_clicks
        )

        def pct(part: int) -> Decimal:
            if not views:
                return Decimal('0.0')
            return (Decimal(part) * Decimal(100) / Decimal(views)).quantize(
                Decimal('0.1'), rounding=ROUND_HALF_UP,
            )

        self.search_mobile_pct = pct(self.search_mobile_views)
        self.search_desktop_pct = pct(self.search_desktop_views)
        self.maps_mobile_pct = pct(self.maps_mobile_views)
        self.maps_desktop_pct = pct(self.maps_desktop_views)


class GA4Metrics(models.Model):
    """Google Analytics 4 monthly performance snapshot."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='ga4_metrics')
    month = models.DateField(help_text='First day of the month')

    # Users & Sessions
    active_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    total_sessions = models.IntegerField(default=0)
    avg_engagement_time_sec = models.IntegerField(default=0, help_text='Average engagement time in seconds')

    # Events
    total_events = models.IntegerField(default=0)
    page_views = models.IntegerField(default=0)
    scrolls = models.IntegerField(default=0)
    phone_clicks = models.IntegerField(default=0)
    estimate_requests = models.IntegerField(default=0)
    whatsapp_clicks = models.IntegerField(default=0)
    email_clicks = models.IntegerField(default=0)
    direction_clicks = models.IntegerField(default=0)
    high_intent_pages = models.IntegerField(default=0)
    financing_interest = models.IntegerField(default=0)

    # Traffic sources (JSON: [{"source": "google / organic", "sessions": 44, "key_events": 252}])
    traffic_sources = models.JSONField(default=list, blank=True, help_text='Top traffic sources with sessions and key events')

    # Country breakdown (JSON: [{"country": "United States", "users": 32, "pct_change": 17.9}])
    country_breakdown = models.JSONField(default=list, blank=True)

    # Top pages (JSON: [{"page": "/", "views": 500}, {"page": "/roofing-services", "views": 120}])
    top_pages = models.JSONField(default=list, blank=True)

    # Page speed (JSON: {"lcp": 2.1, "inp": 150, "cls": 0.05, "mobile_score": 85})
    page_speed = models.JSONField(default=dict, blank=True)

    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['business', 'month']
        ordering = ['-month']
        verbose_name = 'GA4 Metrics'
        verbose_name_plural = 'GA4 Metrics'

    def __str__(self):
        return f"{self.business.name} — GA4 {self.month.strftime('%b %Y')}"


class SearchTermSnapshot(models.Model):
    """Keyword / search term rankings and visibility per month."""
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='search_terms')
    month = models.DateField(help_text='First day of the month')

    class Source(models.TextChoices):
        GBP = 'gbp', 'Google Business Profile'
        GSC = 'gsc', 'Google Search Console'
        BRIGHTLOCAL = 'brightlocal', 'BrightLocal'
        AHREFS = 'ahrefs', 'Ahrefs'

    source = models.CharField(max_length=15, choices=Source.choices)
    keyword = models.CharField(max_length=300)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    avg_position = models.DecimalField(max_digits=6, decimal_places=1, null=True, blank=True)
    local_pack = models.BooleanField(default=False, help_text='Appears in Local Pack?')
    notes = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-month', '-impressions']
        verbose_name = 'Search Term Snapshot'

    def __str__(self):
        return f"{self.business.name} — {self.keyword} ({self.month.strftime('%b %Y')})"


class Report(models.Model):
    client = models.ForeignKey(ClientProfile, on_delete=models.CASCADE, related_name='reports')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    project = models.ForeignKey('clients.Project', on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    monthly_plan = models.ForeignKey(MonthlyPlan, on_delete=models.CASCADE, related_name='reports', null=True, blank=True)
    title = models.CharField(max_length=200)
    pdf = models.FileField(upload_to='reports/%Y/%m/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.business_name} — {self.title}"

    class Meta:
        ordering = ['-created_at']
