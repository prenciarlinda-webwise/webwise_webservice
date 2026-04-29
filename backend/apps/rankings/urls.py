from django.urls import path

from .views import (
    AvgPositionHistoryView,
    CheckDatesView,
    CompetitorRankingsView,
    LatestRankView,
    LocalFinderListView,
    MapsRankListView,
    OrganicRankListView,
    PositionDistributionView,
    RankChangesView,
    RankComparisonView,
    RefreshRankingsView,
    RefreshStatusView,
)

urlpatterns = [
    path("projects/<slug:project_slug>/rankings/organic/", OrganicRankListView.as_view(), name="rankings-organic"),
    path("projects/<slug:project_slug>/rankings/maps/", MapsRankListView.as_view(), name="rankings-maps"),
    path("projects/<slug:project_slug>/rankings/local-finder/", LocalFinderListView.as_view(), name="rankings-local-finder"),
    path("projects/<slug:project_slug>/rankings/latest/", LatestRankView.as_view(), name="rankings-latest"),
    path("projects/<slug:project_slug>/rankings/changes/", RankChangesView.as_view(), name="rankings-changes"),
    path("projects/<slug:project_slug>/rankings/dates/", CheckDatesView.as_view(), name="rankings-dates"),
    path("projects/<slug:project_slug>/rankings/compare/", RankComparisonView.as_view(), name="rankings-compare"),
    path("projects/<slug:project_slug>/rankings/competitors/", CompetitorRankingsView.as_view(), name="rankings-competitors"),
    path("projects/<slug:project_slug>/rankings/distribution/", PositionDistributionView.as_view(), name="rankings-distribution"),
    path("projects/<slug:project_slug>/rankings/avg-history/", AvgPositionHistoryView.as_view(), name="rankings-avg-history"),
    # Per-project on-demand refresh (Celery task). Cost-aware: scoped to one project's keywords.
    path("projects/<slug:project_slug>/rankings/refresh/", RefreshRankingsView.as_view(), name="rankings-refresh"),
    path("rankings/refresh-status/<str:task_id>/", RefreshStatusView.as_view(), name="rankings-refresh-status"),
]
