from django.contrib import admin

from .models import Competitor, CompetitorKeywordOverlap, CompetitorSnapshot


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ["domain", "name", "project", "is_auto_discovered", "created_at"]
    list_filter = ["is_auto_discovered"]
    search_fields = ["domain", "name", "project__domain"]
    raw_id_fields = ["project"]


@admin.register(CompetitorSnapshot)
class CompetitorSnapshotAdmin(admin.ModelAdmin):
    list_display = [
        "competitor", "project", "date", "shared_keywords",
        "competitor_keywords", "avg_position", "domain_rank",
    ]
    list_filter = ["date"]
    raw_id_fields = ["project", "competitor"]
    date_hierarchy = "date"


@admin.register(CompetitorKeywordOverlap)
class CompetitorKeywordOverlapAdmin(admin.ModelAdmin):
    list_display = [
        "keyword_text", "project", "competitor", "date",
        "search_volume", "client_rank", "competitor_rank",
    ]
    list_filter = ["date"]
    search_fields = ["keyword_text"]
    raw_id_fields = ["project", "competitor"]
    date_hierarchy = "date"
