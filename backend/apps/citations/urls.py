from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .import_views import CitationExportView, CitationImportView
from .views import CitationCheckView, CitationDirectoryViewSet, CitationSummaryView, CitationViewSet

router = DefaultRouter()
router.register(r"citations", CitationViewSet, basename="citation")

dir_router = DefaultRouter()
dir_router.register(r"citation-directories", CitationDirectoryViewSet, basename="citation-directory")

urlpatterns = [
    path("projects/<slug:project_slug>/citations/summary/", CitationSummaryView.as_view(), name="citation-summary"),
    path("projects/<slug:project_slug>/citations/import/", CitationImportView.as_view(), name="citation-import"),
    path("projects/<slug:project_slug>/citations/export/", CitationExportView.as_view(), name="citation-export"),
    path("projects/<slug:project_slug>/citations/check/", CitationCheckView.as_view(), name="citation-check"),
    path("projects/<slug:project_slug>/", include(router.urls)),
    path("", include(dir_router.urls)),
]
