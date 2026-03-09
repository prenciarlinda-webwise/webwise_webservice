from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportListCreateView.as_view(), name='report_list'),
    path('<int:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    # GBP Metrics
    path('gbp/', views.GBPMetricsListCreateView.as_view(), name='gbp_metrics_list'),
    path('gbp/<int:pk>/', views.GBPMetricsDetailView.as_view(), name='gbp_metrics_detail'),
    # GA4 Metrics
    path('ga4/', views.GA4MetricsListCreateView.as_view(), name='ga4_metrics_list'),
    path('ga4/<int:pk>/', views.GA4MetricsDetailView.as_view(), name='ga4_metrics_detail'),
    # Search Terms
    path('search-terms/', views.SearchTermListCreateView.as_view(), name='search_terms_list'),
    path('search-terms/<int:pk>/', views.SearchTermDetailView.as_view(), name='search_terms_detail'),
]
