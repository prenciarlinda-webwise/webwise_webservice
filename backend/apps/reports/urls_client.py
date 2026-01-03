from django.urls import path
from .views import ClientReportListView, ClientReportDetailView

urlpatterns = [
    path('reports/', ClientReportListView.as_view(), name='client-reports'),
    path('reports/<int:pk>/', ClientReportDetailView.as_view(), name='client-report-detail'),
]
