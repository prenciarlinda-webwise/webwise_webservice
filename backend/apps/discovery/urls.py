from django.urls import path

from .views import DiscoveryResultListView, DiscoveryRunListView, PromoteKeywordsView, RefreshDiscoveryView

urlpatterns = [
    path("businesses/<slug:business_slug>/discovery/runs/", DiscoveryRunListView.as_view(), name="discovery-runs"),
    path(
        "businesses/<slug:business_slug>/discovery/runs/<int:run_pk>/results/",
        DiscoveryResultListView.as_view(),
        name="discovery-results",
    ),
    path("businesses/<slug:business_slug>/discovery/promote/", PromoteKeywordsView.as_view(), name="discovery-promote"),
    path("businesses/<slug:business_slug>/discovery/refresh/", RefreshDiscoveryView.as_view(), name="discovery-refresh"),
]
