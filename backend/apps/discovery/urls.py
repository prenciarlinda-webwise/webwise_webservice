from django.urls import path

from .views import DiscoveryResultListView, DiscoveryRunListView, PromoteKeywordsView

urlpatterns = [
    path("projects/<slug:project_slug>/discovery/runs/", DiscoveryRunListView.as_view(), name="discovery-runs"),
    path(
        "projects/<slug:project_slug>/discovery/runs/<int:run_pk>/results/",
        DiscoveryResultListView.as_view(),
        name="discovery-results",
    ),
    path("projects/<slug:project_slug>/discovery/promote/", PromoteKeywordsView.as_view(), name="discovery-promote"),
]
