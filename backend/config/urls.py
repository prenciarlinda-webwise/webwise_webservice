"""
URL configuration for the WebWise Dashboard API.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/admin/', include('apps.clients.urls_admin')),
    path('api/admin/', include('apps.plans.urls_admin')),
    path('api/admin/', include('apps.reports.urls_admin')),
    path('api/admin/', include('apps.keywords.urls_admin')),
    path('api/admin/', include('apps.payments.urls_admin')),
    path('api/admin/', include('apps.tasks.urls_admin')),
    path('api/admin/', include('apps.notifications.urls_admin')),
    path('api/client/', include('apps.clients.urls_client')),
    path('api/client/', include('apps.reports.urls_client')),
    path('api/client/', include('apps.keywords.urls_client')),
    path('api/client/', include('apps.payments.urls_client')),
    path('api/client/', include('apps.tasks.urls_client')),
    path('api/client/', include('apps.notifications.urls_client')),
]
