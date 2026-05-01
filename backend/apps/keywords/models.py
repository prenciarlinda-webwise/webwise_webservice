from django.db import models


class KeywordStatus(models.TextChoices):
    TRACKED = "tracked", "Tracked"
    DISCOVERED = "discovered", "Discovered"
    IGNORED = "ignored", "Ignored"
    PAUSED = "paused", "Paused"


class KeywordIntent(models.TextChoices):
    INFORMATIONAL = "informational", "Informational"
    NAVIGATIONAL = "navigational", "Navigational"
    COMMERCIAL = "commercial", "Commercial"
    TRANSACTIONAL = "transactional", "Transactional"
    LOCAL = "local", "Local"


class KeywordTag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    color = models.CharField(max_length=7, default="#6B7280")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Keyword(models.Model):
    business = models.ForeignKey("clients.Business", on_delete=models.CASCADE, related_name="keywords")

    # Core keyword data
    keyword_text = models.CharField(max_length=500, db_index=True)
    status = models.CharField(max_length=20, choices=KeywordStatus.choices, default=KeywordStatus.DISCOVERED)

    # Classification
    intent = models.CharField(max_length=20, choices=KeywordIntent.choices, blank=True)
    tags = models.ManyToManyField(KeywordTag, blank=True, related_name="keywords")
    group_name = models.CharField(max_length=255, blank=True)
    is_branded = models.BooleanField(default=False)
    is_primary = models.BooleanField(default=False)

    # Tracking config
    maps_enabled = models.BooleanField(default=False)
    target_url = models.URLField(max_length=2048, blank=True)
    target_rank = models.IntegerField(null=True, blank=True)

    # Location/language override
    location_code = models.IntegerField(null=True, blank=True)
    location_name = models.CharField(max_length=255, blank=True)
    language_code = models.CharField(max_length=10, blank=True)

    # Search metrics
    search_volume = models.IntegerField(null=True, blank=True)
    competition = models.FloatField(null=True, blank=True)
    competition_level = models.CharField(max_length=20, blank=True)
    cpc = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    keyword_difficulty = models.IntegerField(null=True, blank=True)

    # Traffic estimates (from DataForSEO)
    estimated_traffic = models.FloatField(null=True, blank=True)      # Monthly organic traffic for this keyword
    estimated_traffic_cost = models.FloatField(null=True, blank=True) # Traffic value in USD

    # Current rank snapshot (denormalized).
    # rank_absolute = position counting EVERY SERP element (Local Pack, AI
    # Overview, PAA, image cards, ads...). rank_group = position WITHIN
    # organic web results — what users mean by "I'm #4". Both stored.
    current_organic_rank = models.IntegerField(null=True, blank=True, help_text='rank_absolute (entire SERP page)')
    current_organic_rank_group = models.IntegerField(null=True, blank=True, help_text='rank_group (organic-only position)')
    current_organic_url = models.URLField(max_length=2048, blank=True)
    current_maps_rank = models.IntegerField(null=True, blank=True)
    previous_organic_rank = models.IntegerField(null=True, blank=True)
    previous_maps_rank = models.IntegerField(null=True, blank=True)
    rank_change = models.IntegerField(null=True, blank=True)
    current_mobile_rank = models.IntegerField(null=True, blank=True, help_text='rank_absolute on mobile')
    current_mobile_rank_group = models.IntegerField(null=True, blank=True, help_text='rank_group on mobile (organic-only)')
    previous_mobile_rank = models.IntegerField(null=True, blank=True)
    mobile_rank_change = models.IntegerField(null=True, blank=True)
    current_mobile_url = models.URLField(max_length=2048, blank=True)
    last_checked_at = models.DateField(null=True, blank=True)

    # Discovery metadata
    first_discovered_at = models.DateField(null=True, blank=True)
    discovery_rank = models.IntegerField(null=True, blank=True)
    promoted_at = models.DateTimeField(null=True, blank=True)

    # Notes
    notes = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = [("business", "keyword_text", "location_code")]
        ordering = ["keyword_text"]
        indexes = [
            models.Index(fields=["business", "status"]),
            models.Index(fields=["business", "status", "-search_volume"]),
            models.Index(fields=["business", "-current_organic_rank"]),
        ]

    def __str__(self):
        return f"{self.keyword_text} ({self.business.domain})"

    @property
    def effective_location_code(self):
        return self.location_code or self.business.location_code

    @property
    def effective_language_code(self):
        return self.language_code or self.business.language_code
