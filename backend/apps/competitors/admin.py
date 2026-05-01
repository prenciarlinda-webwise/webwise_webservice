from django.contrib import admin

from .models import Competitor, CompetitorKeywordOverlap, CompetitorSnapshot


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ["domain", "name", "business", "is_auto_discovered", "created_at"]
    list_filter = ["is_auto_discovered"]
    search_fields = ["domain", "name", "project__domain"]
    raw_id_fields = ["business"]


@admin.register(CompetitorSnapshot)
class CompetitorSnapshotAdmin(admin.ModelAdmin):
    list_display = [
        "competitor", "business", "date", "shared_keywords",
        "competitor_keywords", "avg_position", "domain_rank",
    ]
    list_filter = ["date"]
    raw_id_fields = ["business", "competitor"]
    date_hierarchy = "date"


@admin.register(CompetitorKeywordOverlap)
class CompetitorKeywordOverlapAdmin(admin.ModelAdmin):
    list_display = [
        "keyword_text", "business", "competitor", "date",
        "search_volume", "client_rank", "competitor_rank",
    ]
    list_filter = ["date"]
    search_fields = ["keyword_text"]
    raw_id_fields = ["business", "competitor"]
    date_hierarchy = "date"
