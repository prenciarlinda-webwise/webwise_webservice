from django.urls import path
from . import views

urlpatterns = [
    # Client profiles
    path('', views.ClientProfileListView.as_view(), name='client_list'),
    path('<int:pk>/', views.ClientProfileDetailView.as_view(), name='client_detail'),
    path('by-slug/<slug:slug>/', views.ClientProfileDetailView.as_view(), name='client_detail_slug'),
    path('me/', views.MyClientProfileView.as_view(), name='my_client_profile'),

    # Projects
    path('projects/', views.ProjectListCreateView.as_view(), name='project_list'),
    path('projects/<int:pk>/', views.ProjectDetailView.as_view(), name='project_detail'),
    path('projects/by-slug/<slug:slug>/', views.ProjectDetailView.as_view(), name='project_detail_slug'),

    # Project services
    path('services/', views.ProjectServiceListCreateView.as_view(), name='service_list'),
    path('services/<int:pk>/', views.ProjectServiceDetailView.as_view(), name='service_detail'),

    # Monthly plans
    path('plans/', views.MonthlyPlanListCreateView.as_view(), name='plan_list'),
    path('plans/<int:pk>/', views.MonthlyPlanDetailView.as_view(), name='plan_detail'),

    # Quarterly plans
    path('quarterly-plans/', views.QuarterlyPlanListCreateView.as_view(), name='quarterly_plan_list'),
    path('quarterly-plans/<int:pk>/', views.QuarterlyPlanDetailView.as_view(), name='quarterly_plan_detail'),

    # DataForSEO location picker (read-only)
    path('locations/', views.LocationListView.as_view(), name='location_list'),

    # Deliverables
    path('deliverables/', views.DeliverableListCreateView.as_view(), name='deliverable_list'),
    path('deliverables/<int:pk>/', views.DeliverableDetailView.as_view(), name='deliverable_detail'),

    # Service templates
    path('templates/', views.ServiceTemplateListCreateView.as_view(), name='template_list'),
    path('templates/<int:pk>/', views.ServiceTemplateDetailView.as_view(), name='template_detail'),
    path('templates/apply/', views.apply_template, name='apply_template'),
    path('template-items/', views.TemplateDeliverableListCreateView.as_view(), name='template_item_list'),
    path('template-items/<int:pk>/', views.TemplateDeliverableDetailView.as_view(), name='template_item_detail'),

    # Business catalog
    path('catalog/', views.BusinessCatalogListCreateView.as_view(), name='catalog_list'),
    path('catalog/<int:pk>/', views.BusinessCatalogDetailView.as_view(), name='catalog_detail'),
]
