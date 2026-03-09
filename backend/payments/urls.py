from django.urls import path
from . import views

urlpatterns = [
    path('', views.PaymentListCreateView.as_view(), name='payment_list'),
    path('<int:pk>/', views.PaymentDetailView.as_view(), name='payment_detail'),
    path('costs/', views.ProjectCostListCreateView.as_view(), name='cost_list'),
    path('costs/<int:pk>/', views.ProjectCostDetailView.as_view(), name='cost_detail'),
    path('summary/', views.DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('expenses/', views.BusinessExpenseListCreateView.as_view(), name='expense_list'),
    path('expenses/<int:pk>/', views.BusinessExpenseDetailView.as_view(), name='expense_detail'),
    path('exchange-rates/', views.ExchangeRateListView.as_view(), name='exchange_rates'),
]
