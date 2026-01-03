from django.db import models


class Keyword(models.Model):
    """Tracked keyword for a client."""

    client = models.ForeignKey(
        'clients.ClientProfile',
        on_delete=models.CASCADE,
        related_name='keywords'
    )
    keyword = models.CharField(max_length=255)
    target_url = models.URLField(blank=True)
    search_volume = models.PositiveIntegerField(null=True, blank=True)
    difficulty = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text='Keyword difficulty 0-100'
    )
    is_primary = models.BooleanField(
        default=False,
        help_text='Primary vs secondary keyword'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_primary', 'keyword']
        unique_together = ['client', 'keyword']

    def __str__(self):
        return self.keyword

    @property
    def latest_ranking(self):
        """Get the most recent ranking."""
        return self.rankings.first()


class KeywordRanking(models.Model):
    """Historical ranking data for a keyword."""

    class SearchEngine(models.TextChoices):
        GOOGLE = 'google', 'Google'
        BING = 'bing', 'Bing'
        YAHOO = 'yahoo', 'Yahoo'

    keyword = models.ForeignKey(
        Keyword,
        on_delete=models.CASCADE,
        related_name='rankings'
    )
    position = models.PositiveSmallIntegerField(
        help_text='Ranking position (1-100, 0 = not ranked)'
    )
    recorded_date = models.DateField()
    search_engine = models.CharField(
        max_length=20,
        choices=SearchEngine.choices,
        default=SearchEngine.GOOGLE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-recorded_date']
        unique_together = ['keyword', 'recorded_date', 'search_engine']

    def __str__(self):
        return f"{self.keyword.keyword}: #{self.position} on {self.recorded_date}"
