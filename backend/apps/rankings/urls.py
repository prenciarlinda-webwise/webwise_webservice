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
    path("businesses/<slug:business_slug>/rankings/organic/", OrganicRankListView.as_view(), name="rankings-organic"),
    path("businesses/<slug:business_slug>/rankings/maps/", MapsRankListView.as_view(), name="rankings-maps"),
    path("businesses/<slug:business_slug>/rankings/local-finder/", LocalFinderListView.as_view(), name="rankings-local-finder"),
    path("businesses/<slug:business_slug>/rankings/latest/", LatestRankView.as_view(), name="rankings-latest"),
    path("businesses/<slug:business_slug>/rankings/changes/", RankChangesView.as_view(), name="rankings-changes"),
    path("businesses/<slug:business_slug>/rankings/dates/", CheckDatesView.as_view(), name="rankings-dates"),
    path("businesses/<slug:business_slug>/rankings/compare/", RankComparisonView.as_view(), name="rankings-compare"),
    path("businesses/<slug:business_slug>/rankings/competitors/", CompetitorRankingsView.as_view(), name="rankings-competitors"),
    path("businesses/<slug:business_slug>/rankings/distribution/", PositionDistributionView.as_view(), name="rankings-distribution"),
    path("businesses/<slug:business_slug>/rankings/avg-history/", AvgPositionHistoryView.as_view(), name="rankings-avg-history"),
    # Per-project on-demand refresh (Celery task). Cost-aware: scoped to one project's keywords.
    path("businesses/<slug:business_slug>/rankings/refresh/", RefreshRankingsView.as_view(), name="rankings-refresh"),
    path("rankings/refresh-status/<str:task_id>/", RefreshStatusView.as_view(), name="rankings-refresh-status"),
]
