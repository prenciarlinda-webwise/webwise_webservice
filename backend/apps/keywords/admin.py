from django.contrib import admin
from .models import Keyword, KeywordRanking


class KeywordRankingInline(admin.TabularInline):
    model = KeywordRanking
    extra = 1
    ordering = ['-recorded_date']


@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):
    list_display = [
        'keyword', 'client', 'target_url', 'search_volume',
        'difficulty', 'is_primary', 'created_at'
    ]
    list_filter = ['is_primary', 'client', 'created_at']
    search_fields = ['keyword', 'client__company_name', 'target_url']
    raw_id_fields = ['client']
    inlines = [KeywordRankingInline]


@admin.register(KeywordRanking)
class KeywordRankingAdmin(admin.ModelAdmin):
    list_display = ['keyword', 'position', 'recorded_date', 'search_engine']
    list_filter = ['search_engine', 'recorded_date']
    search_fields = ['keyword__keyword']
    raw_id_fields = ['keyword']
